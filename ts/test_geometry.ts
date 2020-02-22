import { expect } from 'chai';
import * as g from './geometry';

describe('project_to_unit_circle function', () => {
    it('should not change position on a unit circle', () => {
        const x = 1;
        const y = 0;
        const result = g.project_to_unit_circle(x, y, 0, 0, 1);
        expect(result[0]).to.equal(x);
        expect(result[1]).to.equal(y);
    })
})