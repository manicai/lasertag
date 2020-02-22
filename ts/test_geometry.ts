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
