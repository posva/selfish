'use strict';
var selfish = require('../selfish');
var should = require('should');
var Base = selfish.Base;

describe('#Base object', function() {
  it('cannot be changed', function() {
    Base.prototype.initialize.should.be.ok;
    (function() {
      Base.prototype.initialize = 0;
    }).should.throw();
  });
  it('properties cannot be added', function() {
    (function() {
      Base.prototype.newVar = 0;
    }).should.throw();
  });
});

describe('#Inheritance', function() {
  it('can add new properties', function() {
    var Animal = Base.extend({
      name: 'Animal',
      log: function() {
        return this.name;
      }
    });
    var a = new Animal();
    should(a.extend).be.ko;
    a.log().should.be.eql('Animal');
    Animal.prototype.isPrototypeOf(a).should.be.true;
    Base.prototype.isPrototypeOf(a).should.be.true;
  });
  it('get the correct prototype inherited', function() {
    var a = new Base();
    Base.prototype.isPrototypeOf(a).should.be.true;
  });
  it.skip('keeps parent behaviour', function() {
    var Proto = selfish.merge(Base, {
      b: 0,
      initialize: function() {
        console.log('I am E');
      }
    });
    Base.initialize(1);
    Proto.initialize(1);
    var E = function ECons() {
      console.log('init E');
      this.prototype.initialize.apply(this, arguments);
      console.log('end E');
    };
    E.prototype = Object.freeze(Proto);
    var e = new E('hello');
  });
});

describe('#Backward compatibility', function() {
  var Foo, Bar, bar, toto, Toto;
  beforeEach(function() {
    Foo = Base.extend({
      initialize: function Foo(options) {
        this.name = options.name;
      }
    });

    Bar = Foo.extend({
      initialize: function Bar(options) {
        Foo.prototype.initialize.call(this, options);
        this.type = 'bar';
      }
    });

    Toto = Base.extend(Foo.prototype, {
      initialize: function(options) {
        Foo.prototype.initialize.call(this, options);
        this.type = 'bar';
      }
    });

    bar = new Bar({
      name: 'test'
    });

    toto = new Toto({
      name: 'toto'
    });
  });
  it('Bar is prototype of Bar.new', function() {
    Bar.prototype.isPrototypeOf(bar).should.be.eql(true);
    should(bar instanceof Foo).be.true;
    should(bar instanceof Bar).be.true;
  });
  it('Foo is prototype of Bar.new', function() {
    Foo.prototype.isPrototypeOf(bar).should.be.eql(true);
  });
  it('Base is prototype of Bar.new', function() {
    Base.prototype.isPrototypeOf(bar).should.be.eql(true);
  });
  it('bar initializer was called', function() {
    bar.type.should.be.eql('bar');
  });
  it('bar initializer called Foo initializer', function() {
    bar.name.should.be.eql('test');
  });
  it.skip('toto instanceof', function() {
    should(toto instanceof Toto).be.true;
    should(toto instanceof Base).be.true;
    should(toto instanceof Foo).be.true;
  });
});
