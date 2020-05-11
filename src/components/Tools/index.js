import React from 'react';

import { config } from '../../utils';

const { tools } = config;

const Tools = () => (
	<div className="container-fluid p-4">
		<div className="row">
			{Object.keys(tools).map(tool => (
				<div className="col-sm-auto" key={tool}>
					<h5>{tool}</h5>
					<ul className="list-unstyled">
						{tools[tool].map((row, i) => (
							<li key={i}>
								<a
									href={row.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									{row.title}
								</a>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	</div>
);

export default Tools;
