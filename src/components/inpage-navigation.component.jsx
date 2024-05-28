import { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({  routes, defaultHidden = [] , defaultActiveIndex = 0 , children}) =>{

    activeTabLineRef = useRef();
    activeTabRef = useRef();
    let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

    let [isResizeEventAdded, setIsResizeEventAdded] = useState(false)

    let [width, setWidth] = useState(window.innerWidth)
    const changePageState = (btn, i) =>{
    
        let {offsetWidth, offsetLeft } = btn;

        activeTabLineRef.current.style.width = offsetWidth + 'px'
        activeTabLineRef.current.style.left = offsetLeft + 'px'

        setInPageNavIndex(i);
    }

    useEffect(() =>{
        if(width > 766 && inPageNavIndex != defaultActiveIndex){
            changePageState(activeTabRef.current, defaultActiveIndex)
        }
     
        if(!isResizeEventAdded){
            window.addEventListener('resize', () =>{
                if(!isResizeEventAdded){
                    setIsResizeEventAdded(true);
                }
                setWidth(window.innerWidth);
            })
        }
    }, [width])


    return(
      <>
        <div className="navigatepage" >

            {
                routes.map((route, i) => {
                   

                    return(

                        <button key={i}
                          ref={i == defaultActiveIndex ? activeTabRef : null}
                          className={"trend " + ( inPageNavIndex == i ? "text-black" : "text-dark" ) + (defaultHidden.includes(route) ? " d-md-none " : " ")}
                          onClick={(e) => {changePageState(e.target, i)}}
                          >
               

                     
                           {route} 
                        </button>

                    )
                })
            }
            <div className="route1"
              ref={activeTabLineRef}
           ></div>
           
        </div>
       

        {Array.isArray(children) ?  children[inPageNavIndex] : children}
      
      </>
    )
}

export default InPageNavigation;