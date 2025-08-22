 /** 
  * PUBLIC_INTERFACE
  * NavBar
  * Top navigation bar with brand, global search, and primary action buttons.
  */
 import React, { useContext } from 'react';
 import { AuthContext } from '../context/AuthContext';
 
 function NavBar({ onCreate, search, onSearch, loading }) {
   const { user, logout } = useContext(AuthContext);
 
   return (
     <header className="navbar" role="banner">
       <div className="brand" aria-label="Notes App">
         <div className="brand-badge">N</div>
         Notes
       </div>
       <div className="searchbar" role="search">
         <span className="icon" aria-hidden>🔎</span>
         <input
           type="search"
           placeholder="Search notes by title, content, or tag…"
           value={search}
           onChange={(e) => onSearch(e.target.value)}
           aria-label="Search notes"
         />
       </div>
       <div className="actions">
         {user ? (
           <>
             <span className="helper" aria-label="Signed in user" style={{ marginRight: 4 }}>
               Hi, {user.displayName}
             </span>
             <button className="btn" onClick={logout}>
               Log out
             </button>
           </>
         ) : null}
         <button className="btn btn-primary" onClick={onCreate} disabled={loading}>
           + New note
         </button>
       </div>
     </header>
   );
 }
 
 export default NavBar;
