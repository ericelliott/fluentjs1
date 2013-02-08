var extend = $.extend;

(function () {


  // Constructors - not so great.
  // Must use "new":
  function Bar() {
    this.band = 'lame';
  }

  var myBar = new Bar();

  /* This would clobber window, or in strict mode,
   * throw an error.

  var brokenBar = Bar();

  */

  test('Constructor', function () {
    equal(typeof myBar, 'object',
      'myBar should be an object');

    /* this test would throw an error:
    equal(brokenBar.band, 'lame',
      'brokenBar should have a band.');
    */
  });

}());



(function () {





  // Constructors must guard "this":
  function Bar() {
    if (!(this instanceof Bar)) {
        return new Bar();
    }
    this.band = 'lame';
  }


  // new, or not? No enforced consistency...
  var myBar = Bar();


  test('Constructor', function () {
    equal(myBar.band, 'lame',
      'myBar should have a band.');
  });




}());


(function () {








  // For one-off objects,
  // use literals:
  var bar = {
    band: 'Dr. Teeth and the Electric Mayhem'
  };

  test('Literal', function () {
    equal(bar.band, 'Dr. Teeth and the Electric Mayhem',
      'Literal assignments should work.');
  });








}());


(function () {









  // For multiple objects, use factory functions:
  function createBar() {
    return {
      band: 'Dr. Teeth and the Electric Mayhem'
    };
  }
  var bar = createBar();

  test('Factories', function () {
    equal(bar.band, 'Dr. Teeth and the Electric Mayhem',
      'Factories should work.');
  });







}());











// For method sharing (flyweight objects),
// Use a prototype. Start with Object.create:
// (Douglas Crockford)
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}















(function () {







  // Use Object.create to set your prototype.
  var barPrototype = {
      open: function open() { /* ... */ },
      close: function close() { /* ... */ },
    };
  function createBar() {
    return Object.create(barPrototype);
  }

  var bar = createBar();

  test('Object.create', function () {
    ok(bar.open,
      'Object should have access to prototype methods.');
  });





}());


(function () {







  // Old and busted:
  function Bar() {
  }

  Bar.prototype.open = function open() { /* ... */ };
  Bar.prototype.close = function close() { /* ... */ };

  var bar = new Bar();


  test('Old prototype assignment', function () {
    ok(bar.open,
      'Object should have access to prototype methods.');
  });







}());


(function () {






  // New hotness:
  var barPrototype = {
      open: function open() { /* ... */ },
      close: function close() { /* ... */ },
    };
  function createBar() {
    return Object.create(barPrototype);
  }

  var bar = createBar();

  test('New prototype assignment', function () {
    ok(bar.open,
      'Object should have access to prototype methods.');
  });






}());


(function () {



  // For data privacy, use vars:
  function createBar() {
    var isOpen = false; // private

    return {
      open: function open() {
        isOpen = true;
        return this;
      },
      close: function close() {
        isOpen = false;
        return this;
      },
      isOpen: function isOpenMethod() {
        return isOpen;
      }
    };
  }

  var bar = createBar();

  test('Privileged methods', function () {
    equal(bar.open().isOpen(), true,
      'Privileged methods should have access'
      + ' to private variables.');
    equal(bar.close().isOpen(), false,
      'Private variable data is shared between'
      + ' privileged methods.');
  });

}());





// Setup some prototypes...
var membership = {
    add: function (member) {
      this.members[member.name] = member;
      return this;
    },
    getMember: function (name) {
      return this.members[name];
    }
  },
  availability = {
    open: function open() {
      isOpen = true;
      return this;
    },
    close: function close() {
      isOpen = false;
      return this;
    },
    isOpen: function isOpenMethod() {
      return isOpen;
    }
  };







(function () {
  'use strict';


  // To inherit behaviors, use mixins:
  var barPrototype = extend({}, membership, 
        availability); 

  function createBar() {
    var instance = Object.create(barPrototype);
    instance.members = {};
    return instance;
  }

  var bar = createBar();

  test('Mixin methods', function () {
    equal(bar.open().isOpen(), true,
      'Availability mixin works.');
    ok(bar.add({
        name:'johnny',
        joined: new Date()})
      .getMember('johnny'),
        'Membership mixin works.');
  });



}());




(function () {
  'use strict';

  // Defaults and options with mixins:
  var barPrototype = extend({}, membership,
      availability);

  function createBar(options) {
    var defaults = {
        name: 'The Saloon',
        specials: 'Whisky, Gin, Tequila'
      },

      instance = Object.create(barPrototype);

    return extend(instance, defaults, options);
  }

  var bar = createBar({
    name: 'The Dead Goat Saloon'
  });

  test('Defaults and options', function () {
    equal(bar.specials, 'Whisky, Gin, Tequila',
      'Defaults should work.');
    equal(bar.name, 'The Dead Goat Saloon',
      'Options should override defaults.');
  });  

}());













// It gets even easier...


/**
 * odotjs - a tiny prototypal object libary.
 * (but that's a different talk...)
 */

// https://github.com/dilvie/odotjs/














(function () {

  // No more switch ... case!

  // Old and busted:
  function doAction(action) {
    var actionlist = ['hack', 'slash', 'run'],
      action = actionlist[Math.round(
          (Math.random() * (actionlist.length -1)))];

    switch (action) {
      case 'hack':
        return 'hack';
      break;

      case 'slash':
        return 'slash';
      break;

      case 'run':
        return 'run';
      break;

      default:
        throw new Error('Invalid action.');
      break;
    }
  }

  test('Switch ... case', function () {
    var testActions = {
        hack: true,
        slash: true,
        run: true
      };
    ok(testActions[doAction()],
      'Should return a valid action');
  });

}());



(function () {

  // New hotness:
  function doAction(action) {
    var actionlist = ['hack', 'slash', 'run'],
      action = actionlist[Math.round(
          (Math.random() * (actionlist.length -1)))];

      actions = {
        'hack': function () {
          return 'hack';
        },

        'slash': function () {
          return 'slash';
        },

        'run': function () {
          return 'run';
        }
      };
   
    if (typeof actions[action] !== 'function') {
      throw new Error('Invalid action.');
    }

    return actions[action]();
  }

  test('Command object', function () {
    var testActions = {
        hack: true,
        slash: true,
        run: true
      };
    ok(testActions[doAction()],
      'Should return a valid action');
  });

}());
