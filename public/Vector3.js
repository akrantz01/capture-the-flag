function Vector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Vector.prototype = {
    negative: function () {
        return new Vector(-this.x, -this.y, -this.z);
    },
    add: function (v) {
        if (v instanceof Vector) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this.clone();
        }
        else {
            this.x += v;
            this.y += v;
            this.z += v;
            return this.clone();
        }
    },
    sub: function (v) {
        if (v instanceof Vector) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this.clone();
        }
        else {
            this.x -= v;
            this.y -= v;
            this.z -= v;
            return this.clone();
        }
    },
    mult: function (v) {
        if (v instanceof Vector) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            return this.clone();
        }
        else {
            this.x *= v;
            this.y *= v;
            this.z *= v;
            return this.clone();
        }
    },
    div: function (v) {
        if (v instanceof Vector) {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
            return this.clone();
        }
        else {
            this.x /= v;
            this.y /= v;
            this.z /= v;
            return this.clone();
        }
    },
    limit: function (mag) {
        if (this.mag() > mag) {
            this.normalize();
            this.mult(mag);
        }
    },
    constrain: function (a, b) {
        this.x = constrain(this.x, a, b);
        this.y = constrain(this.y, a, b);
        this.z = constrain(this.z, a, b);

    },
    normalize: function () {
        let mag = this.mag();
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        return this;
    },
    equals: function (v) {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    },
    dot: function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    cross: function (v) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    },
    mag: function () {
        return Math.sqrt(this.dot(this));
    },
    magSq: function () {
        return this.dot(this);
    },
    unit: function () {
        return this.div(this.mag());
    },
    min: function () {
        return Math.min(Math.min(this.x, this.y), this.z);
    },
    max: function () {
        return Math.max(Math.max(this.x, this.y), this.z);
    },
    setMag: function (mag) {
        let transform = mag / this.mag();
        this.x *= transform;
        this.y *= transform;
        this.z *= transform;
    },
    toAngles: function () {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.mag())
        };
    },
    angleTo: function (a) {
        return Math.acos(this.dot(a) / (this.mag() * a.mag()));
    },
    toArray: function (n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    },
    clone: function () {
        return new Vector(this.x, this.y, this.z);
    },
    init: function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },
    toBabylon: function () {
        return new BABYLON.Vector3(this.x, this.y, this.z);
    }
};

Vector.negative = function (a, c) {
    let b = c || new Vector();
    b.x = -a.x;
    b.y = -a.y;
    b.z = -a.z;
    return b;
};
Vector.add = function (a, b, d) {
    let c = d || new Vector();
    if (b instanceof Vector) {
        c.x = a.x + b.x;
        c.y = a.y + b.y;
        c.z = a.z + b.z;
    }
    else {
        c.x = a.x + b;
        c.y = a.y + b;
        c.z = a.z + b;
    }
    return c;
};
Vector.sub = function (a, b, d) {
    let c = d || new Vector();
    if (b instanceof Vector) {
        c.x = a.x - b.x;
        c.y = a.y - b.y;
        c.z = a.z - b.z;
    }
    else {
        c.x = a.x - b;
        c.y = a.y - b;
        c.z = a.z - b;
    }
    return c;
};
Vector.mult = function (a, b, d) {
    let c = d || new Vector();
    if (b instanceof Vector) {
        c.x = a.x * b.x;
        c.y = a.y * b.y;
        c.z = a.z * b.z;
    }
    else {
        c.x = a.x * b;
        c.y = a.y * b;
        c.z = a.z * b;
    }
    return c;
};
Vector.div = function (a, b, d) {
    let c = d || new Vector();
    if (b instanceof Vector) {
        c.x = a.x / b.x;
        c.y = a.y / b.y;
        c.z = a.z / b.z;
    }
    else {
        c.x = a.x / b;
        c.y = a.y / b;
        c.z = a.z / b;
    }
    return c;
};
Vector.cross = function (a, b, d) {
    let c = d || new Vector();
    c.x = a.y * b.z - a.z * b.y;
    c.y = a.z * b.x - a.x * b.z;
    c.z = a.x * b.y - a.y * b.x;
    return c;
};
Vector.unit = function (a, c) {
    let b = c || new Vector();
    var length = a.mag();
    b.x = a.x / length;
    b.y = a.y / length;
    b.z = a.z / length;
    return b;
};
Vector.dist = function (a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
};
Vector.distsq = function (a, b) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2);
};
Vector.fromAngles = function (theta, phi) {
    return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
};
Vector.randomDirection = function () {
    return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
};
Vector.min = function (a, b) {
    return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};
Vector.max = function (a, b) {
    return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};
Vector.lerp = function (a, b, fraction) {
    return b.subtract(a).multiply(fraction).add(a);
};
Vector.fromArray = function (a) {
    return new Vector(a[0], a[1], a[2]);
};
Vector.angleBetween = function (a, b) {
    return a.angleTo(b);
};

function fromBabylon(vec) {
    return new Vector(vec.x, vec.y, vec.z);
};

function constrain(x, a, b) {
    if (x < a) x = a;
    else if (x > b) x = b;
    return x;
}
