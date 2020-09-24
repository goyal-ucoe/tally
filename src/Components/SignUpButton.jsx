import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function SignUpButton(props) {

    return (<div>
                <a href={props.href} name={props.name} className="btn btn-light d-block w-100 shadow-sm p-3 
                border_light_grey mt-2 text-primary font-weight-bold" onClick={props.signUpInAction}>
                    <div className="row">
                        <div className="pl-3">
                            <FontAwesomeIcon className={props.fontIconColor} 
                            icon={props.fontIconName}/>
                        </div>
                        <div className="col-sm">
                            {props.name}
                        </div>
                    </div>    
                </a>
            </div>);
  }

export default SignUpButton;