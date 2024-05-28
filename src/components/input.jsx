import { useState } from "react"

const InputBox =({name, type, id , value, placeholder, icon, disable = false})=>{

    const [passwordVisible, setPasswordVisible] = useState(false);

    return(
            <>
               <div className="relative w-[100%] mb-4">
                    <input
                        name={name}
                        type={type == "password" ? passwordVisible ? "text" : "password" : type}
                        placeholder={placeholder}
                        defaultValue={value}
                        id={id}
                        disabled={disable}
                        className="input-box"
                    />
                      <i className={"bi " +  icon + " input-icon" }  style={{ position: 'absolute', padding:'5px', marginTop:'2px' }}></i>
                    {
                        type == "password" ?
                           <i className ={"bi bi-eye" + (!passwordVisible ? "-slash " : "") + "  pass cursor-pointer"} style={{position:'absolute', marginTop:'7px'}}
                            onClick={() => setPasswordVisible(currentVal=> !currentVal
                            )}
                           ></i>
                        :""
                    }
               </div>
            </>
    )
}

export default InputBox