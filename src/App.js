

import "./styles.css"
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import { useReducer } from 'react';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
/*the if block below allows for new calculation to overwrite old completed calculation */ 
    if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }


      /*line below restricts 0 to one digit when pressing it continously*/
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
      case ACTIONS.CHOOSE_OPERATION: 
        if (state.currentOperand == null && state.previousOperand == null) {
          return state
        }
/*the block below allows for changing operation ex: 2+2+ but you want to change to multiply*/
        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation,
          }
        }
/*the block below is when current operand is displayed and pressing an operation it will move the numbers+operation to the previous operand spot in the calculator */
        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        }

/*block below allows for the calculation to continue when doing more than one operation ex: 2+2+2 */
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }
      case ACTIONS.CLEAR:
        return {}
      
      case ACTIONS.DELETE_DIGIT: 
        if (state.overwrite) {
          return {
          ...state,
          overwrite: false,
          currentOperand: null
          }
        }
/*if statement below is checking the state to see if there is a current operand  */
        if (state.currentOperand == null) return state
/*if statement below is checking to see if there is one digit then to remove it and leave it as null instead of having an empty string */
        if (state.currentOperand.length === 1) {
          return { ...state, currentOperand: null }
        }
/*defualt case below */
        return {
          ...state,
/*below line is removing the last digit from the current operand */
          currentOperand: state.currentOperand.slice(0, -1)
        }
    /*block below prevents calculation to execute when pressing = and the values dont have numbers */
      case ACTIONS.EVALUATE:
        if (state.operation == null || 
          state.currentOperand == null || 
          state.previousOperand == null
          ) {
          return state
        }
/*below return block allows calculation to execute when pressing = */
/*the overwrite: true enables the overwrite */
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state)
        }
  }
}
/*the below function allows for auto calculation and displays in the previous operand spot when doing more than one operation */
function evaluate({ currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  
  if (isNaN(prev) || isNaN(current)) return ""
  
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "/":
      computation = prev / current
      break
    case "*":
      computation = prev * current
      break
  }

  return computation.toString()

}
/* below we're making sure there are no fractions */
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [interger, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(interger)
  return `${INTEGER_FORMATTER.format(interger)}. ${decimal}`
}

function App() {
  const [ {currentOperand, previousOperand, operation}, dispatch ] = useReducer(
    reducer,
    {}
  )

  
    return (
        <div className="calculator-grid">
            <div className="output">
                <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
                <div className="current-operand">{formatOperand(currentOperand)}</div>
            </div>
            <button 
              className="span-two" 
              onClick={() => dispatch({ type: ACTIONS.CLEAR })}
            >
              AC
            </button>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
            >DEL</button>
            <OperationButton operation="/" dispatch={dispatch} /> 
            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} /> 
            <DigitButton digit="3" dispatch={dispatch} />
            <OperationButton operation="*" dispatch={dispatch} />
            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />
            <OperationButton operation="+" dispatch={dispatch} />
            <DigitButton digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />
            <OperationButton operation="-" dispatch={dispatch} />
            <DigitButton digit="." dispatch={dispatch} />
            <DigitButton digit="0" dispatch={dispatch} />
            <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE})}
>=</button>
        </div>
    )
}

export default App;