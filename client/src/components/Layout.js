import { Outlet, Link } from "react-router-dom";

function Layout(){
  if (!sessionStorage.getItem('token')) {
    return (
      <>
        <nav>
          <ul>
            {/*<li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            */}
            
            {/* <li>
              <Link to="/create">Create</Link>
            </li> */}
          </ul>
        </nav>

        <Outlet />
      </>
    )
  }
  if(sessionStorage.getItem('accesslevel') == 0){
    return (
      <>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {/* <li>
              <Link to="/login">Login</Link>
            </li> */}
            <li>
              <Link to="/create">Create Post</Link>
            </li>
            <li>
              <Link to="/logout">Log out</Link>
            </li>
          </ul>
        </nav>

        <Outlet />
      </>
    )
  }
  if(sessionStorage.getItem('accesslevel') == 5){
    return (
      <>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {/* <li>
              <Link to="/login">Login</Link>
            </li> */}
            <li>
              <Link to="/create">Create Post</Link>
            </li>
            <li>
              <Link to="/classes">Classes</Link>
            </li>
            <li>
              <Link to="/logout">Log out</Link>
            </li>
          </ul>
        </nav>

        <Outlet />
      </>
    )
  }
}

export default Layout;