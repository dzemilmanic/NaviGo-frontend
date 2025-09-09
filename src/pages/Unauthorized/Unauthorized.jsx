import './Unauthorized.css';
const UnauthorizedPage = () => (
  <div
    className='unauthorized-container'
  >
    <div
      className='unauthorized-content'
    >
      <h1
      className='unauthorized-title'
      >
        Unauthorized
      </h1>
      <p className='unauthorized-message'>
        You don't have permission to access this page.
      </p>
      <a  className ='unauthorized-link' href="/">Go to back</a>
    </div>
  </div>
);
export default UnauthorizedPage;