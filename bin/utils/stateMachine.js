/**
 * Statemachine class : testContext specific
 * Give us the acknowledgment of running test or just initialization
 */
class StateMachine{

    static states = {
    INIT_STATE : "init",
    ON_GOING_STATE : "onGoing"
    }

    constructor(){
        this.state = StateMachine.states.INIT_STATE;
    }

    isInitState() {return this.state == StateMachine.states.INIT_STATE;}
    isOnGoinState() {return this.state == StateMachine.states.ON_GOING_STATE;}

    setState(state){
        this.state = state;
    }
}

module.exports = StateMachine