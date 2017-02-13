var _ = require('lodash');
const log = console.log;

var StateManager = function (init , component ,repository) {
    this.currentState = new init(this);
    this.repository = repository;
    this.component = component;
 
    this.change = function (state) {
        this.currentState = state;
        this.currentState.branch(this.component,this.repository);
    };
    this.start = function () {
        this.currentState.branch();
    };
}

var Order = function(){
    this.id = 0;
    this.label = "Component order";
    //this.paymode = "CB";
    //this.billData = {};
}
Order.prototype = {
};

var OrderRepository = function(){
}
OrderRepository.prototype = {
   Gate : function(id,order){
       switch (id) {
         case 1 :
           return this.EvaluateOrder(order);
         case 2 : 
           return this.EvaluatePayment(order);
         default :
           break;
       }
    },
   EvaluatePayment : function(order){
    var result = false;
    return result;
   },
   EvaluateOrder : function(order){
    var result = true;
    return result;
   }
};

var State = function(StateManager){
    this.manager = StateManager;
}

var InitState = function(StateManager){
  State.call(this);
  this.manager = StateManager;
  console.log('initialisation');
}

InitState.prototype = _.create(State.prototype, { 
    branch : function(){
     this.manager.change(new EvaluateState(this.manager));  
    }
});

var EvaluateState = function(StateManager){
  State.call(this);
  this.manager = StateManager;
  this.repository = StateManager.repository;
  this.order = StateManager.order;
  log("evaluate order");
}

EvaluateState.prototype = _.create(State.prototype, { 
  branch : function(){
      var orderTest = this.repository.Gate(1,this.order);
      if(orderTest){
       log("Order correct");
       this.manager.change(new PaymentState(this.manager));
      }
      else {
       this.manager.change(new CancelState(this.manager));
      }
  } 
});

var PaymentState = function(StateManager){
  State.call(this);
  this.manager = StateManager;
  this.repository = StateManager.repository;
  this.order = StateManager.order;
}

PaymentState.prototype = _.create(State.prototype, {
	branch : function(){
  	log("evaluate payment");
    var paymentTest = this.repository.Gate(2,this.order);
    if(paymentTest){
       log("order payed");
       this.manager.change(new ShipState(this.manager));
    }else{
       log("payment error");
       this.manager.change(new CancelState(this.manager));  
     }
    } 
});

var ShipState = function(StateManager){
  this.manager = StateManager;
  console.log('Ship Order');
}
ShipState.prototype = _.create(State.prototype, {
	branch : function(){
      console.log("end");
  } 
});

var CancelState = function(StateManager){
  this.manager = StateManager;
  console.log('Cancel Order');
}

CancelState.prototype = _.create(State.prototype, {
  branch : function(){
      console.log("end");
  } 
});

function run() {
    var orderManagement = new StateManager(InitState,new Order(),new OrderRepository());
    orderManagement.start();
}

run();
