import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { soundManager } from '../utils/sound';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  max-width: 1000px;
  height: 100vh;
  margin: 0 auto;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0.3rem 0;
  text-align: center;
  font-family: 'Comic Sans MS', cursive;
`;

const Question = styled.div`
  font-size: 3rem;
  margin: 0.3rem 0;
  text-align: center;
  color: #34495e;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
`;

const AnswerInput = styled.input`
  font-size: 2.2rem;
  padding: 0.6rem;
  width: 100px;
  text-align: center;
  margin: 0.3rem 0;
  border: 3px solid #3498db;
  border-radius: 12px;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #2980b9;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
  }
`;

const Button = styled.button`
  font-size: 1.6rem;
  padding: 0.8rem 1.6rem;
  margin: 0.3rem;
  cursor: pointer;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', cursive;
  
  &:hover {
    background-color: #27ae60;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }

  &.next {
    background-color: #3498db;
    &:hover {
      background-color: #2980b9;
    }
  }
`;

const Explanation = styled(motion.div)`
  margin-top: 0.5rem;
  padding: 0.8rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  text-align: center;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
`;

const Block = styled.div<{ step: number }>`
  width: 50px;
  height: 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.step === 1 ? '/images/blocks/block-step1.svg' : '/images/blocks/block-step2.svg'});
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: popIn 0.5s ease forwards;
  opacity: 0;
  transform: scale(0) rotate(-180deg);

  @keyframes popIn {
    to {
      opacity: 1;
      transform: scale(1) rotate(0);
    }
  }

  &::after {
    content: attr(data-number);
    position: absolute;
    font-size: 1.2rem;
    font-weight: bold;
    color: #2c3e50;
    text-shadow: 1px 1px 0 white;
    font-family: 'Comic Sans MS', cursive;
  }
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
`;

const StepIcon = styled.div`
  width: 80px;
  height: 80px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 0.5rem;
`;

const ResultContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ResultNumber = styled.div`
  font-size: 2.5rem;
  color: #e74c3c;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive;
`;

interface MathProblem {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
  userAnswer?: number;
  timestamp?: number;
}

const generateProblem = (): MathProblem => {
  const operator = Math.random() < 0.5 ? '+' : '-';
  let num1, num2, answer;
  
  if (operator === '+') {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * (10 - num1)) + 1;
    answer = num1 + num2;
  } else {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * num1);
    answer = num1 - num2;
  }
  
  return { num1, num2, operator, answer };
};

const QuestionContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
`;

const ButtonGroup = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
  align-items: center;

  &.left {
    left: 2rem;
  }

  &.right {
    right: 2rem;
  }
`;

const IconButton = styled(Button)`
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
`;

const SoundButton = styled(IconButton)`
  background-color: #3498db;
  width: 3.2rem;
  height: 3.2rem;
  font-size: 1.6rem;
  &:hover {
    background-color: #2980b9;
  }
`;

const ModeButton = styled(IconButton)`
  background-color: #9b59b6;
  width: 3.2rem;
  height: 3.2rem;
  font-size: 1.6rem;
  &:hover {
    background-color: #8e44ad;
  }
  position: relative;
`;

const ErrorCount = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e74c3c;
  color: white;
  font-size: 1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  min-width: 24px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ErrorList = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  padding: 1rem;
  z-index: 1000;
  overflow-y: auto;
`;

const ErrorItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ErrorProblem = styled.div`
  font-size: 1.5rem;
  color: #2c3e50;
`;

const CloseButton = styled(Button)`
  position: fixed;
  top: 1rem;
  left: 1rem;
  background-color: #e74c3c;
  &:hover {
    background-color: #c0392b;
  }
`;

const SuccessAnimation = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: none;
`;

const SuccessText = styled(motion.div)`
  font-size: 2.5rem;
  color: #2ecc71;
  font-weight: bold;
  text-align: center;
  margin-top: 1rem;
  font-family: 'Comic Sans MS', cursive;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Star = styled(motion.div)`
  font-size: 3rem;
  color: #f1c40f;
  text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
`;

const MathGame: React.FC = () => {
  const [problem, setProblem] = useState<MathProblem>(generateProblem());
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [errorProblems, setErrorProblems] = useState<MathProblem[]>([]);
  const [showErrorList, setShowErrorList] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const savedErrors = localStorage.getItem('errorProblems');
    if (savedErrors) {
      setErrorProblems(JSON.parse(savedErrors));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('errorProblems', JSON.stringify(errorProblems));
  }, [errorProblems]);

  useEffect(() => {
    const muted = localStorage.getItem('soundMuted') === 'true';
    setIsMuted(muted);
    if (muted) {
      soundManager.toggleMute();
    }
  }, []);

  const toggleSound = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
    localStorage.setItem('soundMuted', String(newMuted));
  };

  const checkAnswer = () => {
    const answer = parseInt(userAnswer);
    const correct = answer === problem.answer;
    
    if (!correct) {
      soundManager.play('wrong');
      const errorProblem = {
        ...problem,
        userAnswer: answer,
        timestamp: Date.now()
      };
      setErrorProblems(prev => [...prev, errorProblem]);
      setShowExplanation(true);
    } else {
      soundManager.play('correct');
      setShowSuccess(true);
      setTimeout(() => {
        soundManager.play('success');
        setShowSuccess(false);
        if (isReviewMode) {
          const currentTimestamp = problem.timestamp;
          setErrorProblems(prev => prev.filter(p => p.timestamp !== currentTimestamp));
          if (errorProblems.length > 1) {
            const remainingProblems = errorProblems.filter(p => p.timestamp !== currentTimestamp);
            const randomIndex = Math.floor(Math.random() * remainingProblems.length);
            const selectedProblem = remainingProblems[randomIndex];
            setProblem(selectedProblem);
            setUserAnswer('');
            setShowExplanation(false);
          } else {
            setProblem(generateProblem());
            setUserAnswer('');
            setShowExplanation(false);
            setIsReviewMode(false);
          }
        } else {
          setProblem(generateProblem());
          setUserAnswer('');
          setShowExplanation(false);
        }
      }, 1500);
    }
  };

  const nextProblem = () => {
    if (isReviewMode && errorProblems.length > 0) {
      const randomIndex = Math.floor(Math.random() * errorProblems.length);
      const selectedProblem = errorProblems[randomIndex];
      setProblem(selectedProblem);
      setUserAnswer('');
      setShowExplanation(false);
    } else {
      setProblem(generateProblem());
      setUserAnswer('');
      setShowExplanation(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const removeError = (timestamp: number) => {
    setErrorProblems(prev => prev.filter(p => p.timestamp !== timestamp));
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;
  };

  const handleButtonClick = () => {
    soundManager.play('click');
  };

  if (showErrorList) {
    return (
      <ErrorList
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <CloseButton onClick={() => setShowErrorList(false)}>×</CloseButton>
        <Title>错题记录</Title>
        {errorProblems.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>暂无错题记录</div>
        ) : (
          errorProblems.map((p) => (
            <ErrorItem key={p.timestamp}>
              <div>
                <ErrorProblem>
                  {p.num1} {p.operator} {p.num2} = ?
                </ErrorProblem>
                <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                  {formatTime(p.timestamp || 0)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button onClick={() => {
                  handleButtonClick();
                  setProblem(p);
                  setShowErrorList(false);
                  setIsReviewMode(true);
                  setShowExplanation(false);
                }}>练习</Button>
                <Button onClick={() => removeError(p.timestamp || 0)}>删除</Button>
              </div>
            </ErrorItem>
          ))
        )}
      </ErrorList>
    );
  }

  return (
    <GameContainer>
      <Title>趣味数学 - 10以内加减法</Title>
      <QuestionContainer>
        <ButtonGroup className="left">
          <SoundButton onClick={toggleSound}>
            {isMuted ? '🔇' : '🔊'}
          </SoundButton>
        </ButtonGroup>
        <Question>
          {problem.num1} {problem.operator} {problem.num2} = ?
        </Question>
        <ButtonGroup className="right">
          <ModeButton onClick={() => {
            handleButtonClick();
            setShowErrorList(true);
          }}>
            📝
            {errorProblems.length > 0 && (
              <ErrorCount>{errorProblems.length}</ErrorCount>
            )}
          </ModeButton>
        </ButtonGroup>
      </QuestionContainer>
      
      <AnswerInput
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="?"
      />
      
      {!showExplanation && (
        <Button onClick={() => {
          handleButtonClick();
          checkAnswer();
        }}>✓</Button>
      )}
      
      <AnimatePresence>
        {showSuccess && (
          <SuccessAnimation
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Star
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              ⭐
            </Star>
            <SuccessText
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              太棒了！
            </SuccessText>
          </SuccessAnimation>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExplanation && (
          <Explanation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {problem.operator === '+' ? (
              <>
                <StepContainer>
                  <BlockContainer>
                    {Array.from({ length: problem.num1 }).map((_, i) => (
                      <Block
                        key={`num1-${i}`}
                        step={1}
                        data-number={i + 1}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </BlockContainer>
                </StepContainer>
                
                <StepContainer>
                  <StepIcon style={{ backgroundImage: 'url("/images/icons/plus.svg")' }} />
                  <BlockContainer>
                    {Array.from({ length: problem.num2 }).map((_, i) => (
                      <Block
                        key={`num2-${i}`}
                        step={2}
                        data-number={i + 1}
                        style={{ animationDelay: `${(i + problem.num1) * 0.1}s` }}
                      />
                    ))}
                  </BlockContainer>
                </StepContainer>
                
                <ResultContainer>
                  <StepIcon style={{ backgroundImage: 'url("/images/icons/equals.svg")' }} />
                  <BlockContainer>
                    {Array.from({ length: problem.num1 }).map((_, i) => (
                      <Block
                        key={`result-num1-${i}`}
                        step={1}
                        data-number={i + 1}
                        style={{ animationDelay: `${i * 0.1 + (problem.num1 + problem.num2) * 0.1}s` }}
                      />
                    ))}
                    {Array.from({ length: problem.num2 }).map((_, i) => (
                      <Block
                        key={`result-num2-${i}`}
                        step={2}
                        data-number={problem.num1 + i + 1}
                        style={{ animationDelay: `${(i + problem.num1) * 0.1 + (problem.num1 + problem.num2) * 0.1}s` }}
                      />
                    ))}
                  </BlockContainer>
                  <ResultNumber>{problem.answer}</ResultNumber>
                </ResultContainer>
              </>
            ) : (
              <>
                <StepContainer>
                  <BlockContainer>
                    {Array.from({ length: problem.num1 }).map((_, i) => (
                      <Block
                        key={`num1-${i}`}
                        step={1}
                        data-number={i + 1}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </BlockContainer>
                </StepContainer>
                
                <StepContainer>
                  <StepIcon style={{ backgroundImage: 'url("/images/icons/minus.svg")' }} />
                  <BlockContainer>
                    {Array.from({ length: problem.num2 }).map((_, i) => (
                      <Block
                        key={`num2-${i}`}
                        step={2}
                        data-number={i + 1}
                        style={{ animationDelay: `${i * 0.1 + problem.num1 * 0.1}s` }}
                      />
                    ))}
                  </BlockContainer>
                </StepContainer>
                
                <ResultContainer>
                  <StepIcon style={{ backgroundImage: 'url("/images/icons/equals.svg")' }} />
                  <BlockContainer>
                    {Array.from({ length: problem.num1 }).map((_, i) => (
                      <Block
                        key={`num1-${i}`}
                        step={1}
                        data-number={i + 1}
                        style={{ 
                          animationDelay: `${i * 0.1}s`,
                          opacity: i < problem.answer ? 1 : 0.4,
                          transform: i < problem.answer ? 'scale(1) rotate(0)' : 'scale(0.95) rotate(0)',
                          filter: i < problem.answer ? 'none' : 'grayscale(80%) brightness(1.1) blur(1px)'
                        }}
                      />
                    ))}
                  </BlockContainer>
                  <ResultNumber>{problem.answer}</ResultNumber>
                </ResultContainer>
              </>
            )}
            <Button 
              className="next" 
              onClick={() => {
                handleButtonClick();
                nextProblem();
              }}
            >
              {isReviewMode ? '下一题' : '下一题 →'}
            </Button>
          </Explanation>
        )}
      </AnimatePresence>
    </GameContainer>
  );
};

export default MathGame; 