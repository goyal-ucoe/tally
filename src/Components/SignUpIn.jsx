import React, { useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../Styles/SignUpIn.css';
import {signUpButtonJSON, email, apple} from '../Scripts/signUpInBtn';
import {CLIENT_URL, SERVER_URL} from '../Scripts/config';
import SignUpButton from './SignUpButton';

const filterButton = apple;


function SignUpIn(){

    const [label, setLabel] = React.useState('More Options');
    const [signUpInLabel, setSignUpInLabel] = React.useState('How do you want to sign up?');
    const [signUpButtons,setSignUpButtons] = React.useState([]);
    const [isMoreOptions,setIsMoreOptions] = React.useState(false);
    const [isSignUpPage,setIsSignUpPage] = React.useState(true);
    const [isEmailAction,setIsEmailAction] = React.useState(false);
    const [passwordStrength, setPasswordStrength] = React.useState({});
    const [user,setUser] = React.useState({});
    const [passwordEye, setPasswordEye] = React.useState({type:'password',name:'eye'});
    const [passwordMatch,setPasswordMatch] = React.useState({});

    function signUpInAction(event){

        const name = event.currentTarget.name;
        console.log('Name--> ',name);
        if(name === email){
            const labelName = isSignUpPage ? 'Sign up with your email' : 'Log in with your email';
            setLabel(labelName);
            setIsEmailAction(true);
        }else if(name === 'signUpBtn'){
            
            const forms = document.forms[0];
            let isValid = true;
            for(let i = 0; i < forms.length; i++){
                if(forms[i].required && !forms[i].value){
                    forms[i].classList.add('validationError');
                    isValid = false;
                }else{
                    forms[i].classList.remove('validationError');
                }
            }

            if(isValid && passwordMatch['isPasswordMatch']){
                axios.post(SERVER_URL + '/register', user, {withCredentials: true})
                .then(res => {
                    console.log('Data --> ',res.data);
                    if(res.data === 'Successfully Authenticated'){
                        window.open(CLIENT_URL + '/sucessfull','_self');
                    }
                });
            }
            
        }else if(name === 'loginBtn'){
            
        }

    }


    function signUpButtonList(){
        return signUpButtons.map((curBtn,idx)=>{
                return <SignUpButton 
                                key={idx}
                                name={curBtn.name}
                                fontIconName={curBtn.fontIconName}
                                fontIconColor={curBtn.fontIconColor}
                                href={curBtn.href}
                                onClick={signUpInAction}
                    />;
        });
    }

   function backButton(){
        setIsMoreOptions(false);
        setIsEmailAction(false);
        setSignUpButtons(signUpButtonJSON.filter(curBtn => curBtn.name !== filterButton));
   }

    function moreOptions(){
        setIsMoreOptions(true);
        setLabel('More Options');
        setSignUpButtons(signUpButtonJSON.filter(curBtn => curBtn.name === filterButton));
    }

    function isSignUpInToggle(){
        setIsSignUpPage(prevValue => {
            const value = !prevValue;
            const signUpInLabelValue = value ? "How do you want to sign up?" : "Let's get you logged in";
            setSignUpInLabel(signUpInLabelValue);
            return value;
        });
        
    }

    function passwordEyeClickAction(event){
        if(passwordEye.type === 'password'){
            setPasswordEye({type:'text',name:'eye-slash'});
        }else{
            setPasswordEye({type:'password',name:'eye'});
        }
    }

    function onValueChange(event){
        // eslint-disable-next-line
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        // eslint-disable-next-line
        var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

        const name = event.currentTarget.name;
        const value = event.currentTarget.value;


        if(name === 'password'){
            if(value){
                if(strongRegex.test(value)){
                    setPasswordStrength({color:'strong',text:'Stronger'});
                }else if(mediumRegex.test(value)){
                    setPasswordStrength({color:'medium',text:'Little bit more'});
                }else{
                    setPasswordStrength({color:'weak',text:'Weak'});
                } 
            }else{
                setPasswordStrength({});
            }
        }

        if(name === 'confirmPassword'){
            if(value){
                if(value === user.password){
                    setPasswordMatch({color:'green', text:'match', isPasswordMatch : true});
                }else{
                    setPasswordMatch({color:'red',text:'not  match', isPasswordMatch : false});
                }
            }else{
                setPasswordMatch({});
            }
        }

        if(name !== 'confirmPassword'){
            setUser(prevValue => {
                return {...prevValue, [name] : value};
            });
        }
        
        //console.log(user);
    }

    useEffect(() => {
        setSignUpButtons(signUpButtonJSON.filter(curBtn => curBtn.name !== filterButton));
        axios.get(SERVER_URL + '/', {withCredentials: true})
        .then(res => {
            console.log('Data --> ',res.data);
            if(res.data === 'Successfully Authenticated'){
                window.open(CLIENT_URL + '/sucessfull','_self');
            }
        });
    }, []);
 
    return <div className="text-center bg-image sign_up_in position_fixed">   
                <form className="form-signin">
                    <div className="p-5 bg-light rounded-lg shadow position-relative">
                        <div className={(isMoreOptions || isEmailAction) ? "text-left position-absolute customBackBtnAlign" : "d-none"}>
                            <span className="roundIcon border_light_grey text-center" onClick={backButton}>
                                <FontAwesomeIcon  icon={['fas','long-arrow-alt-left']}/>
                            </span>
                        </div>
                        
                        {(isMoreOptions || isEmailAction) ? 
                            <h4 className="mb-4">
                                {label}
                            </h4> 
                            : 
                            <h6 className="mb-4">
                                {signUpInLabel}
                            </h6>
                        }
                        
                        <div className={!isEmailAction ? "d-none" : "text-left"}>
                            <div className={isSignUpPage ? "d-inline" : "d-none"}>
                                <label htmlFor="inputFirstName" className="sr-only">First Name</label>
                                <input type="text" id="inputFirstName" name="firstName" className="form-control firstName" placeholder="First Name" autoComplete="new-password" required value={user.firstName} onChange={onValueChange}/>
                            </div>
                            <div className={isSignUpPage ? "d-inline" : "d-none"}>
                                <label htmlFor="inputLastName" className="sr-only">Last Name</label>
                                <input type="text" id="inputLastName" name="lastName" className="form-control lastName" placeholder="Last Name" autoComplete="new-password" required value={user.lastName} onChange={onValueChange}/>
                            </div>
                            
                            
                            <label htmlFor="inputEmail" className="sr-only">Email address</label>
                            <input type="email" id="inputEmail" name="email" className={isSignUpPage ? "form-control signUp" : "form-control"} placeholder="Email address" autoComplete="new-password" required value={user.email} onChange={onValueChange}/>
                            
                            <div className="position-relative">
                                <label htmlFor="inputPassword" className="sr-only">Password</label>
                                <input type={passwordEye.type} id="inputPassword" name="password" className={isSignUpPage ? "form-control signUp" : "form-control"} placeholder="Password" autoComplete="new-password" required value={user.password} onChange={onValueChange}/>
                                <span className="position-absolute passwordEye" onClick={passwordEyeClickAction}>
                                    <FontAwesomeIcon  icon={['fas',passwordEye.name]}/>
                                </span>
                            </div>
                            
                            <div className={isSignUpPage ? "position-relative" : "d-none"}>
                                <label htmlFor="inputConfirmPassword" className="sr-only">Confirm Password</label>
                                <input type="password" id="inputConfirmPassword" name="confirmPassword" className="form-control"
                                placeholder="Confirm Password" autoComplete="new-password" onChange={onValueChange} required/> 
                                <span className="position-absolute passwordMatch" style={{color:passwordMatch.color}}>
                                    {passwordMatch.text}
                                </span>
                            </div>
                            


                            <div className={"row mx-0 passwordStrength " + passwordStrength.color}>
                                <div className="col-2 px-0 padding_right weak align-self-end">
                                    <div className="passwordStrengthShower"></div>
                                </div>
                                <div className="col-2 px-0 padding_right medium align-self-end">
                                    <div className="passwordStrengthShower"></div>
                                </div>
                                <div className="col-2 px-0 padding_right strong align-self-end">
                                    <div className="passwordStrengthShower"></div>
                                </div>
                                <div className="col-6 passwordStrengthTextSize" >
                                    {passwordStrength.text}
                                </div>
                            </div>
                            <div>
                                <span className="mandatoryTextSize text-danger">
                                    * All fields are mandatory
                                </span>
                            </div>
                            <div className={isSignUpPage ? "" : "d-none"}>
                                <button type="button" name="signUpBtn" className="btn btn-primary d-block w-100 shadow-sm p-3 
                                    border_light_grey mt-2 font-weight-bold" onClick={signUpInAction}>
                                    Sign Up
                                </button>
                            </div>
                            <div className={isSignUpPage ? "d-none" : ""}>
                                <button type="button" name="loginBtn" className="btn btn-primary d-block w-100 shadow-sm p-3 
                                    border_light_grey mt-2 font-weight-bold" onClick={signUpInAction}>
                                    Log In
                                </button>
                            </div>
                        </div>

                        <div className={isEmailAction ? "d-none" : ""}>
                            {signUpButtonList()}
                        </div>
                        <div className={(isMoreOptions || isEmailAction) ? "d-none" : "mt-4"}>
                            <button type="button" className="btn btn-link link_font_size "
                                    onClick={moreOptions}>
                                More options
                            </button>
                            <span className={isSignUpPage ? "d-none" : ""}>.</span>
                            <button type="button" className={isSignUpPage ? "d-none" : "btn btn-link link_font_size"}>
                                Can't log in?
                            </button>
                            <span>.</span>
                            <button type="button" className="btn btn-link link_font_size link_outline" 
                            onClick={isSignUpInToggle}>
                                {isSignUpPage ? "Log In" : "Sign Up"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>;
}

export default SignUpIn;