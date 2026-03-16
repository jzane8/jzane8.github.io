/**
 * Contact page — email and LinkedIn links.
 */
export default function Contact() {
  return (
    <>
      <h3>Contact</h3>
      <p>
        Get in contact with Jake via{' '}
        <a href="mailto:jacobzane1997@gmail.com">email</a> or{' '}
        <a
          href="https://www.linkedin.com/in/jake-zane-a56305138/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/linkedin-logo.png"
            alt="LinkedIn"
            style={{ width: 140, height: 35, verticalAlign: 'middle' }}
          />
        </a>
      </p>
    </>
  );
}
