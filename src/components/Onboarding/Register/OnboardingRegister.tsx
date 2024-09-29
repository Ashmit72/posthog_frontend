import React, { useState } from "react";
import "./OnboardingRegister.css";

const questions = [
  { label: "What is Your Favorite Food?", stateKey: "favoriteFood" },
  { label: "What is Your Hobby?", stateKey: "hobby" },
  { label: "What is Your Nickname?", stateKey: "nickname" },
];

interface OnboardingProps {
  showOnboarding: boolean;
  onComplete:()=>void
  fetchedId:number | null
}


const Onboarding= ({showOnboarding,onComplete,fetchedId}:OnboardingProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [favoriteFood, setFavoriteFood] = useState<string>("");
  const [hobby, setHobby] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    switch (currentQuestion) {
      case 0:
        setFavoriteFood(value);
        break;
      case 1:
        setHobby(value);
        break;
      case 2:
        setNickname(value);
        break;
      default:
        break;
    }
  };



  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log({ favoriteFood, hobby, nickname });
      const onboardObject={
        food:favoriteFood,
        hobby,
        nickname
      }
      console.log(onboardObject,fetchedId);
      
      try {
        const response=await fetch(`/api/onboard/${fetchedId}`,{
          headers: {
            "Content-Type": "application/json",
          },
          method:'POST',
          body:JSON.stringify(onboardObject)
        })
        if (response.ok) {
          onComplete()
        }
        else{
          console.log('Somthing Went Wrong!');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
showOnboarding?
    (<div className="overlay">
      <div className="onboarding-container">
        <h1>Onboarding</h1>
        <form onSubmit={(e) => e.preventDefault}>
          <div className="input-group">
            <label htmlFor={questions[currentQuestion].stateKey}>
              {questions[currentQuestion].label}
            </label>
            <input
              type="text"
              id={questions[currentQuestion].stateKey}
              value={
                currentQuestion === 0
                  ? favoriteFood
                  : currentQuestion === 1
                  ? hobby
                  : nickname
              }
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="button" onClick={handleNext}>
            {currentQuestion < questions.length - 1 ? "Next" : "Submit"}
          </button>
        </form>
      </div>
    </div>):null
  );
};

export default Onboarding;
