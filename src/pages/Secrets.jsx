import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Secrets page — a password-gated canvas platformer game.
 * Password "tng" uses the detailed player sprite; anything else uses a stick figure.
 */

const BALL_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

export default function Secrets() {
  const [entered, setEntered] = useState(false);
  const [password, setPassword] = useState('');
  const stickFigure = useRef(true);

  function submit() {
    stickFigure.current = password !== 'tng';
    setEntered(true);
  }

  return (
    <div style={styles.page}>
      {!entered ? (
        <div style={styles.passwordBox}>
          <h1 style={{ color: '#333', marginBottom: 30, fontSize: '2.5em' }}>Secrets</h1>
          <label htmlFor="secrets-pw" style={{ display: 'none' }}>Password</label>
          <input
            id="secrets-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoFocus
            style={styles.input}
          />
          <br />
          <button onClick={submit} style={styles.btn}>Enter</button>
        </div>
      ) : (
        <Game useStickFigure={stickFigure.current} />
      )}
    </div>
  );
}

function Game({ useStickFigure }) {
  const canvasRef = useRef(null);
  const state = useRef({
    running: true,
    score: 0,
    speed: 2,
    obstacles: [],
    spawnTimer: 0,
    player: { x: 100, y: 300, velY: 0, jumping: false, grounded: true, width: 40, height: 80 },
  });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem('ballStepperHighScore'), 10) || 0
  );
  const [gameOver, setGameOver] = useState(false);

  const [restartCount, setRestartCount] = useState(0);

  const draw = useCallback((ctx) => {
    const s = state.current;
    ctx.clearRect(0, 0, 800, 400);

    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 380, 800, 20);

    // Player
    const p = s.player;
    if (useStickFigure) {
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(p.x + 20, p.y + 10, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(p.x + 19, p.y + 20, 2, 40);
      ctx.fillRect(p.x + 10, p.y + 60, 10, 2);
      ctx.fillRect(p.x + 20, p.y + 60, 10, 2);
      ctx.fillRect(p.x + 10, p.y + 30, 20, 2);
    } else {
      ctx.fillStyle = '#FF1493';
      ctx.fillRect(p.x + 10, p.y + 20, 20, 40);
      ctx.beginPath(); ctx.arc(p.x + 20, p.y + 10, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(p.x + 12, p.y + 60, 6, 20);
      ctx.fillRect(p.x + 22, p.y + 60, 6, 20);
      ctx.fillStyle = '#000';
      ctx.fillRect(p.x + 10, p.y + 75, 10, 5);
      ctx.fillRect(p.x + 20, p.y + 75, 10, 5);
      ctx.fillStyle = '#FF69B4';
      ctx.fillRect(p.x + 10, p.y + 20, 20, 30);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(p.x + 15, p.y + 15, 10, 5);
    }

    // Obstacles
    for (const ob of s.obstacles) {
      if (ob.isRainbow) {
        const g = ctx.createLinearGradient(ob.x, ob.y, ob.x + ob.size, ob.y + ob.size);
        ['red','orange','yellow','green','blue','indigo','violet'].forEach((c, i) =>
          g.addColorStop(i / 6, c)
        );
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = ob.color;
      }
      ctx.beginPath();
      ctx.arc(ob.x + ob.size / 2, ob.y + ob.size / 2, ob.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(ob.x + ob.size / 2 - 5, ob.y + ob.size / 2 - 5, ob.size / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [useStickFigure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let lastTime = 0;

    function loop(time) {
      const s = state.current;
      if (!s.running) return;

      const delta = lastTime ? time - lastTime : 16;
      lastTime = time;

      // Physics
      if (s.player.jumping) {
        s.player.velY += 0.8;
        s.player.y += s.player.velY;
        if (s.player.y >= 300) {
          s.player.y = 300;
          s.player.velY = 0;
          s.player.jumping = false;
          s.player.grounded = true;
        }
      }

      // Spawn
      s.spawnTimer += delta;
      if (s.spawnTimer >= 1500) {
        const size = Math.random() * 30 + 20;
        s.obstacles.push({
          x: 800,
          y: 380 - size,
          size,
          color: BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)],
          isRainbow: Math.random() < 0.1,
        });
        s.spawnTimer = 0;
      }

      // Move & collide
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const ob = s.obstacles[i];
        ob.x -= s.speed;
        if (ob.x + ob.size < 0) {
          s.obstacles.splice(i, 1);
          s.score += 10;
          setScore(s.score);
          if (s.score % 100 === 0) s.speed += 0.5;
          continue;
        }
        // Collision
        const p = s.player;
        if (p.x < ob.x + ob.size && p.x + p.width > ob.x &&
            p.y < ob.y + ob.size && p.y + p.height > ob.y) {
          if (ob.isRainbow) {
            s.score += 50;
            setScore(s.score);
            s.obstacles.splice(i, 1);
          } else {
            s.running = false;
            if (s.score > parseInt(localStorage.getItem('ballStepperHighScore') || '0', 10)) {
              localStorage.setItem('ballStepperHighScore', String(s.score));
              setHighScore(s.score);
            }
            setGameOver(true);
            return;
          }
        }
      }

      draw(ctx);
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [draw, restartCount]);

  // Keyboard
  useEffect(() => {
    function onKey(e) {
      if (e.code === 'Space') {
        e.preventDefault();
        const p = state.current.player;
        if (p.grounded && !p.jumping) {
          p.velY = -15;
          p.jumping = true;
          p.grounded = false;
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function restart() {
    const s = state.current;
    s.score = 0; s.speed = 2; s.obstacles = []; s.spawnTimer = 0;
    s.player = { x: 100, y: 300, velY: 0, jumping: false, grounded: true, width: 40, height: 80 };
    s.running = true;
    setScore(0);
    setGameOver(false);
    setRestartCount((c) => c + 1);
  }

  return (
    <div style={{ textAlign: 'center', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 10, color: '#333', fontWeight: 'bold', fontSize: 24 }}>
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        role="img"
        aria-label="Platformer game - press spacebar to jump over obstacles"
        style={{
          border: '3px solid #333',
          borderRadius: 10,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 70%, #90EE90 100%)',
          maxWidth: '100%',
        }}
      />
      <div style={{ color: '#333', fontSize: 18, marginTop: 10 }}>
        Press SPACEBAR to jump! Avoid the colorful balls!
      </div>
      {gameOver && (
        <div style={styles.gameOverBox}>
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button onClick={restart} style={styles.restartBtn}>Play Again</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    margin: 0, padding: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: "'Arial', sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  passwordBox: {
    background: 'rgba(255,255,255,0.95)',
    padding: 40,
    borderRadius: 20,
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  input: {
    padding: '15px 25px',
    fontSize: 18,
    border: '2px solid #ddd',
    borderRadius: 25,
    width: 200,
    margin: 20,
    textAlign: 'center',
  },
  btn: {
    padding: '15px 30px',
    fontSize: 18,
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: 25,
    cursor: 'pointer',
    margin: 10,
  },
  gameOverBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(255,255,255,0.95)',
    padding: 30,
    borderRadius: 15,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    textAlign: 'center',
    zIndex: 20,
  },
  restartBtn: {
    padding: '10px 20px',
    fontSize: 16,
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: 20,
    cursor: 'pointer',
    marginTop: 15,
  },
};
