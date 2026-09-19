import profile from"./assets/Screenshot From 2026-09-19 18-38-18.png";
import "./header.css"
function Header() {

    return (
                <header>
                    <h1 className="h1">My Website</h1>
                    <img className="img" src={profile}/>
                    <nav>
                        
                             <a>LOGIN</a>
                            <li>
                            <input type="email" placeholder="enter email"></input>
                           
                            </li>
                            <li>
                                 <input type="password" placeholder="enter password"></input>

                                 
                                </li>    
                        
                            
                            <li>
                            <button className="submit" type="submit">Submit</button>
                            </li>
                            <li>
                                <p3><a href="">FORGET PASSWORD?</a></p3>
                            </li>
                        
                    </nav>

                    <p1></p1>  
                <br></br>      
                    <p2><a className="register" href="#">REGISTER HERE</a></p2> 
                    <br></br>
                    
         </header>

    )
    
}

export default Header