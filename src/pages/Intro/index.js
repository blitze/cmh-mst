import React from 'react';
import { useHistory } from 'react-router-dom';

function Intro() {
	const history = useHistory();
	const handleClick = () => history.push('/settings/general');

	const style = {
		backgroundImage: 'url(https://placeimg.com/640/480/nature/grayscale)',
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
	};

	return (
		<div className="h-100" style={style}>
			<div className="container d-flex h-100 align-items-center">
				<div className="mx-auto text-center">
					<h1 className="mx-auto my-0 text-uppercase text-white font-weight-bold">
						Welcome
					</h1>
					<p className="lead text-white-50 mx-auto mt-2 mb-5">
						domr yrcy
					</p>
					<button
						type="button"
						className="btn btn-primary btn-lg rounded-pill px-5 py-2 mt-3"
						onClick={handleClick}
					>
						Let's Go
					</button>
				</div>
			</div>
		</div>
	);
}

export default Intro;
