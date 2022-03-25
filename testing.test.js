const { expect } = require("@jest/globals");

function sum(a,b)
{
    return a+b;
}

test("Addition ",()=>
{
    expect(sum(1,1)).toBe(2);
});