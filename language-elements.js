function Le(concept) {
  var a, args = new Array(arguments.length); 
  args[0] = concept;
  for (var i=1; i < arguments.length; i++) {
    a = arguments[i];
    if (Array.isArray(a)) {
      a.__proto__ = args;
    }
    args[i] = a;
  }
  return args;
}

Array.prototype.parent = function() {
  if (Array.prototype === this.__proto__) {
    return undefined;
  }
  return this.__proto__;
}

Array.prototype.concept = function() {
  if (this.length == 0) {
    return undefined;
  }
  return this[0];
}

Array.prototype.children = function() {
  return this.slice(1);
}

Array.prototype.depth = function() {
  var d=0, n=this;
  while (n !== undefined) {
    n=n.parent();
    d++;
  }
  return d;
}