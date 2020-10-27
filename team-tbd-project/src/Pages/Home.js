import React from "react";
import "../../src/App.css";
import "./Home.css";
import HomeLogged from "../Components/HomeComponents/HomeLogged";
import HomeUnLogged from "../Components/HomeComponents/HomeUnLogged";
function Home() {
  var user = { isLoggedIn: false };
  return <div>{user.isLoggedIn ? <HomeLogged /> : <HomeUnLogged />}</div>;
}

export default Home;
