/**
 * Music page — OnRecord band project.
 */
export default function Music() {
  return (
    <>
      <div className="background-image" id="music-image">
        <img
          src="/images/CMAC_jazzhands.jpg"
          alt="CMAC band performing"
          style={{ width: '100%', borderRadius: 8 }}
        />
      </div>

      <h3>Music</h3>

      <div id="onrecord">
        <h4>OnRecord</h4>
        <p>
          In the spring of 2018, I competed in a UChicago-organized songwriting
          competition where each musician was assigned random teammates and told to
          write and record a song over the course of a month and a half. I was the
          lead singer, joined by Aaron Cendan on drums, Greer Baxter on keyboard and
          vocals, Matt Williams on Bass, and Eli Winter on guitar. We received third
          place for submitting the following song, &ldquo;Sunbeam&rdquo;:
        </p>

        <img
          src="/images/smileyoureoncamera.jpg"
          alt="OnRecord video thumbnail"
          id="onrecord1"
        />

        <div className="facebook-embed-container">
          <iframe
            src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F561582230866733%2Fvideos%2F610479725976983%2F&show_text=0&width=560"
            id="sunbeamvid"
            width="560"
            height="315"
            className="facebook-video"
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="encrypted-media"
            title="Sunbeam music video"
          />
          <div className="fallback-message">
            <p>
              If the video doesn&rsquo;t load, you can{' '}
              <a
                href="https://www.facebook.com/561582230866733/videos/610479725976983/"
                target="_blank"
                rel="noopener noreferrer"
              >
                view it directly on Facebook
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
