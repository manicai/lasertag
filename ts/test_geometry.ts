import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as g from './geometry';

describe('project_to_unit_circle function', () => {
    it('should not change position on a unit circle', () => {
        const x = 1;
        const y = 0;
        const result = g.project_to_unit_circle(x, y, 0, 0, 1);
        expect(result[0]).to.equal(x);
        expect(result[1]).to.equal(y);
    });
    it('should reduce the items based on the radius', () => {
        const result = g.project_to_unit_circle(0, 2, 0, 0, 2);
        expect(result[0]).to.equal(0);
        expect(result[1]).to.equal(1);
    });
    it('should shift the center to 0, 0', () => {
        const result = g.project_to_unit_circle(-1, 1, -1, 1, 1);
        expect(result[0]).to.equal(0);
        expect(result[1]).to.equal(0);
    });
});

describe('map_to_control_diamond function', () => {
    const test_points = [
        [ 0, 0 ],
        [ 0, 1 ],
        [ 1, 0 ],
        [ -1, 0 ],
        [ 0, -1],
        [ 0.5, 0 ],
        [ 0, -0.5 ]
    ];

    test_points.forEach((test) => {
        it('should not move point on the axis ' + test, () => {
            const result = g.map_to_control_diamond(test[0], test[1]);
            expect(result[0], 'x co-ordinate').to.equal(test[0]);
            expect(result[1], 'y co-ordinate').to.equal(test[1]);
        })
    });

    const quadrants = [
        [  1,  1 ],
        [ -1,  1 ],
        [ -1, -1 ],
        [  1,  1 ]
    ];
    quadrants.forEach((signs) => {
        const x = signs[0] / Math.sqrt(2.0);
        const y = signs[1] / Math.sqrt(2.0);
        const e_x = signs[0] * 0.5;
        const e_y = signs[1] * 0.5;
        it('should map  [' + x + ', ' + y + '] to [' + e_x + ', ' + e_y + ']', () => {
            const result = g.map_to_control_diamond(x, y);
            expect(result[0], 'x co-ordinate').to.be.closeTo(e_x, 0.000001);
            expect(result[1], 'y co-ordinate').to.be.closeTo(e_y, 0.000001);
        });
    });
});

describe('calculate_motor_power function', () => {
    // Values from iPhone X
    const c_x = 163;
    const c_y = 254;
    const r = 82;

    it('should give zeroes for centre', () => {
        const result = g.calculate_motor_power(c_x, c_y, c_x, c_y, r);
        expect(result[0]).to.equal(0);
        expect(result[1]).to.equal(0);
    });
    it('should give full power for straight forward', () => {
        const result = g.calculate_motor_power(c_x, c_y - r, c_x, c_y, r);
        expect(result[0]).to.equal(1.0);
        expect(result[1]).to.equal(1.0);
    });
    it('should give full power back for straight back', () => {
        const result = g.calculate_motor_power(c_x, c_y + r, c_x, c_y, r);
        expect(result[0]).to.equal(-1.0);
        expect(result[1]).to.equal(-1.0);
    });
    it('should give fast anticlockwise rotation for full left', () => {
        const result = g.calculate_motor_power(c_x - r, c_y, c_x, c_y, r);
        expect(result[0]).to.equal(-1.0);
        expect(result[1]).to.equal( 1.0);
    });
    it('should give fast clockwise rotation for full right', () => {
        const result = g.calculate_motor_power(c_x + r, c_y, c_x, c_y, r);
        expect(result[0]).to.equal(1.0);
        expect(result[1]).to.equal( -1.0);
    });
});
