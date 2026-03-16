/**
 * Home / About page — work history timeline with animated cards.
 */
export default function About() {
  const workHistory = [
    {
      period: '2022-Present',
      title: 'Sr. Software Developer and Tech Lead',
      company: 'AdaptHealth L.L.C.',
      description:
        'Working as a software developer and tech lead at AdaptHealth L.L.C.',
    },
    {
      period: '2022',
      title: 'Graduated with M.S.',
      company: 'University of Colorado at Boulder',
      description:
        "Graduated with my master's degree in computer science and intelligent systems at the University of Colorado at Boulder.",
    },
    {
      period: '2019-2020',
      title: 'Research Assistant',
      company: 'Human-Computer Integration Lab, University of Chicago',
      description: (
        <>
          Worked as a research assistant in the{' '}
          <a
            href="https://lab.plopes.org/"
            className="lab-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Human-Computer Integration Lab
          </a>{' '}
          at the University of Chicago under professor Pedro Lopes.
        </>
      ),
    },
    {
      period: '2020',
      title: 'Graduated with B.S.',
      company: 'University of Chicago',
      description: 'Completed undergraduate studies at the University of Chicago.',
    },
    {
      period: '2018',
      title: 'Research & Development',
      company: 'UnitedHealthGroup (Savvysherpa)',
      description:
        "Worked for UnitedHealthGroup's Research & Development division (Savvysherpa) during the summer of 2018 developing devices that monitored user biometric data and helping to run studies that analyzed biometric responses to stress stimuli.",
    },
    {
      period: '2017',
      title: 'App Development Intern',
      company: 'Arrow Electronics',
      description:
        'Worked as an app development intern during the summer of 2017 for Arrow Electronics, designing web apps that helped project managers assess and analyze price data.',
    },
    {
      period: '2015-2016',
      title: 'Web Development and Marketing Intern',
      company: 'CheddarUp',
      description:
        'Worked as a web development intern during the summer of 2016 for CheddarUp (cheddarup.com) to develop the website. Also worked as a marketing intern at CheddarUp during the summer of 2015, expanding the ways the company advertised to new users and kept in contact with existing ones through online advertising platforms.',
    },
  ];

  return (
    <>
      <div className="content-intro">
        <p>Software Engineer.</p>
        <p>
          Development-related interests include human-computer interaction, machine
          learning, data science, computer security and game design.
        </p>
        <p>
          Other interests include music (specifically vocals), historical research,
          and esports (both competing and organizing).
        </p>
      </div>

      <h3>Work History</h3>

      <div className="work-timeline">
        {workHistory.map((item, i) => (
          <div className="work-item" key={i}>
            <div className="work-period">{item.period}</div>
            <div className="work-title">{item.title}</div>
            <div className="work-company">{item.company}</div>
            <div className="work-description">{item.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}
