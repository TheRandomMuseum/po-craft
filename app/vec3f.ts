export default class Vec3f {
    constructor(public x = 0, public y = 0, public z = 0) {

    }

    add(other: Vec3f) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
    }

    cross(other: Vec3f) {
        return new Vec3f(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        )
    }

    magnitudeSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    magnitude() {
        return Math.sqrt(this.magnitudeSquared());
    }

    normalize() {
        const m = this.magnitude();
        return new Vec3f(this.x / m, this.y / m, this.z / m);
    }

    multiplyTo(n: number) {
        return new Vec3f(this.x * n, this.y * n, this.z * n)
    }
}