import * as React from 'react';

var a = [];
a.concat([111]);
a.findIndex((value) => value === 111);
Array.of();

interface TestProps{
}
const Test: React.StatelessComponent<TestProps> = () => {
	return (
		<button type={'submit'} test test22233={1}>
			<input type="text"/>
			<span></span>
		</button>
	);
};
export default Test;

