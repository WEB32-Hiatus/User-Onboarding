import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';

const formSchema = yup.object().shape({
    name: yup.string().required('Name is a required field'),
    email: yup
    .string()
    .email()
    .required('Must include a valid email'),
    password: yup.string().required('Invalid password'), 
    terms: yup.boolean().oneOf([true], 'Please agree to the terms of service'),
});

export default function Form() {

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: '',
        terms: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        terms: ''
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [users, setUsers] = useState([]);

    useEffect(function () {

        formSchema.isValid(formState).then(function (valid) {
            setButtonDisabled(!valid);
        });
    }, [formState]);

    const validateChange = function (e) {

        yup
        .reach(formSchema, e.target.name)
        .validate(e.target.value)
        .then(function (valid) {
            setErrors({
                ...errors, 
                [e.target.name]: ''
            });
        })
        .catch(function (err) {
            setErrors({
                ...errors,
                [e.target.name]: err.errors[0]
            });
        });
    };

    const formSubmit = function (e) {
        e.preventDefault();
        axios
            .post('https://reqres.in/api/users', formState)
            .then(function (res) {
            setUsers([...users, res.data.name]);
            console.log('success', users);

            setFormState({
                name: '',
                email: '',
                password: '',
                terms: '',
            });
        })
        .catch(function (err) {
            console.log(err.res);
        });
    };

    const inputChange = function (e) {
        e.persist();
        const newFormData = {
            ...formState, 
            [e.target.name]: 
                e.target.type === 'checkbox' ? e.target.checked : e.target.value
        };
        validateChange(e);
        setFormState(newFormData);
    };

    return (
        <form onSubmit={formSubmit}>
            <label htmlFor='name'>
                Name
                <input id='name' type='text' name='name' value={formState.name} onChange={inputChange}/>
                {errors.name.length > 0 ? <p className='error'>{errors.name}</p> : null}
            </label>
            <label htmlFor='email'>
                Email 
                <input id='email' type='text' name='email' value={formState.email} onChange={inputChange}/>
                {errors.email.length > 0 ? (<p className='error'>{errors.email}</p>) : null}
            </label>
            <label htmlFor='password'>
                Password 
                <input id='password' name='password' value={formState.password} onChange={inputChange}/>
                {errors.password.length > 0 ? (<p className='error'>{errors.password}</p>) : null}
            </label>
            <label htmlFor='terms' className='terms'>
                <input type='checkbox' name='terms' checked={formState.terms} onChange={inputChange}/>
                Terms of Service
            </label>

            <pre>{JSON.stringify(users, null, 2)}</pre>
            <button disabled={buttonDisabled}>Submit</button>
        </form>
    );
};