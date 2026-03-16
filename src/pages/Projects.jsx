/**
 * Projects showcase page.
 */
export default function Projects() {
  const projects = [
    {
      id: 4,
      title: 'PCB HeatMapper - 2020',
      description: (
        <>
          Set of files that maps the heat dispersal on a PCB. &ldquo;maxheat.ulp&rdquo; is an
          extension file for Autodesk&rsquo;s EAGLE schematic design software. When run from a .brd
          file in EAGLE, the .ulp file will gather data from the board and send it to the python
          file, which then generates a graphic displaying the heat dispersal on the board. This
          graphic is saved as a .bmp file, which can then be overlayed on the board with one of
          EAGLE&rsquo;s built-in ULPs. Source code can be found{' '}
          <a
            href="https://github.com/jzane8/HeatMapThubber"
            target="_blank"
            rel="noopener noreferrer"
          >
            here.
          </a>
        </>
      ),
    },
    {
      id: 3,
      title: 'Trigeminal Smell Detection Glasses - 2019',
      description:
        "Working with Jas Brooks at the University of Chicago's Human-Computer Integration Lab, I've been building a device that uses three gas sensors to triangulate the location of a gas source, and then informs the user of its direction relative to themselves using EMS on the trigeminal nerve. This project hopes to allow people without a sense of smell to simulate what it is like to smell, by making use of the nervous system rather than smell receptors.",
    },
    {
      id: 2,
      title: 'Online Biometric Response Integration & Display - 2018',
      description:
        "Made while working for UnitedHealthGroup R&D. Integrates Movesense biometric sensors with Google Cloud and a chart display to give live feedback over the internet of a user's ECG, temperature, and heart rate data. Could be used by doctors and nurses to monitor the vitals of patients without requiring them to be at a hospital 24/7.",
    },
    {
      id: 1,
      title: 'Beauty Project - 2016',
      description: (
        <>
          Platforming game I made in javascript canvas for a high school english class
          project where we were assigned to &ldquo;make something beautiful&rdquo;. Game can be played{' '}
          <a
            href="https://jzane8.github.io/BeautyProject/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here.
          </a>
        </>
      ),
    },
  ];

  return (
    <>
      <h3>Projects</h3>
      <div className="project-wrapper">
        {projects.map((p) => (
          <div className="project" key={p.id}>
            <h4>{p.title}</h4>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
