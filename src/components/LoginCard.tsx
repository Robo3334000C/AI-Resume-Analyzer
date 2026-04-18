import React from 'react';
import './LoginCard.css';
import { usePuterStore } from '../store/puterStore';

const LoginCard = () => {
  const { login } = usePuterStore();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Puter AI handles its own auth window, so we just trigger window.puter.auth.signIn()
    login(); 
  };

  return (
    <div className="login-card-wrapper">
      <div className="wrapper">
        <div className="card-switch">
          <label className="switch">
            <input type="checkbox" className="toggle" />
            <span className="slider" />
            <span className="card-side" />
            <div className="flip-card__inner">
              <div className="flip-card__front">
                <div className="title">Log in</div>
                <form className="flip-card__form" onSubmit={handleAuth}>
                  <input className="flip-card__input" name="email" placeholder="Email" type="email" />
                  <input className="flip-card__input" name="password" placeholder="Password" type="password" />
                  <button className="flip-card__btn" type="submit">Let`s go!</button>
                </form>
              </div>
              <div className="flip-card__back">
                <div className="title">Sign up</div>
                <form className="flip-card__form" onSubmit={handleAuth}>
                  <input className="flip-card__input" placeholder="Name" type="text" />
                  <input className="flip-card__input" name="email" placeholder="Email" type="email" />
                  <input className="flip-card__input" name="password" placeholder="Password" type="password" />
                  <button className="flip-card__btn" type="submit">Confirm!</button>
                </form>
              </div>
            </div>
          </label>
        </div>   
      </div>
    </div>
  );
}

export default LoginCard;
