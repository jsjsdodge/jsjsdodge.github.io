function XorShift32() {
    this.sa = new Uint32Array(1);  
    this.saveSeed = new Uint32Array(1);
}

XorShift32.prototype.nextState = function() {
    var x = new Uint32Array(1);
    x[0] = this.sa[0];
    x[0] ^= x[0] << 13;
    x[0] ^= x[0] >> 17;
    x[0] ^= x[0] << 5;
    this.sa[0] = x[0]; 
}
XorShift32.prototype.randInt = function() {
    this.nextState();
    return this.sa[0];
}

XorShift32.prototype.randFloat = function() {
    this.nextState();
    var maxU = 0xFFFFFFFF;
    return (this.sa[0] - 0)/(maxU - 0); 
}

XorShift32.prototype.randIntRange = function(mi, ma) {
    var v = this.randInt();
    return mi + (v % (ma - mi + 1));
}

XorShift32.prototype.randFloatRange = function(mi, ma) {
    var v = this.randFloat();
    return mi + v * (ma - mi);
}

XorShift32.prototype.seed = function(a) {
    this.sa[0] = a;
    this.saveSeed[0] = a;
}

XorShift32.prototype.getBaseSeed = function() { return this.saveSeed[0]; }

export {XorShift32};
