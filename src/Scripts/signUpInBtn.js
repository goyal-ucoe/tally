import {SERVER_URL} from './config';

const [google,facebook,email,apple] = ['Google','Facebook','Email','Apple'];

const signUpButtonJSON = [
    {
        name : google,
        fontIconName : ['fab','google'],
        fontIconColor : 'text-danger',
        href : SERVER_URL + '/auth/google'
    },
    {
        name : facebook,
        fontIconName : ['fab','facebook-f'],
        fontIconColor : 'text-primary',
        href : SERVER_URL + '/auth/facebook'
    },
    {
        name : email,
        fontIconName : ['fas','envelope'],
        fontIconColor : 'text-primary',
        href : '#'
    },
    {
        name : apple,
        fontIconName : ['fab','apple'],
        fontIconColor : 'text-primary',
        href : '#'
    }
];

export  {signUpButtonJSON, google, facebook, email, apple};