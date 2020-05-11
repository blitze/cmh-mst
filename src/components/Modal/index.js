import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

function Modal({
	open,
	children,
	title,
	footer = true,
	closeBtnTitle = 'Close',
	submitBtnTitle = 'Proceed',
	onSubmit,
	onCancel,
	ui,
}) {
	const show = open || ui.modal;

	return (
		<div
			className={'modal' + (show ? ' d-block' : '')}
			tabIndex="-1"
			role="dialog"
		>
			<div className="modal-dialog shadow-lg" role="document">
				<div className="modal-content">
					{title ? (
						<div className="modal-header">
							<h4 className="modal-title">{title}</h4>
							<button
								type="button"
								className="close"
								aria-label="Close"
								onClick={onCancel}
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
					) : (
						<div className="w100">
							<button
								type="button"
								className="close mr-2 pull-right"
								aria-label="Close"
								onClick={onCancel}
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
					)}
					<div className="modal-body">{children}</div>
					{footer && (
						<div className="modal-footer">
							{onSubmit && (
								<button
									type="button"
									className="btn btn-primary"
									onClick={onSubmit}
								>
									{submitBtnTitle}
								</button>
							)}
							<button
								type="button"
								className="btn btn-secondary"
								onClick={onCancel}
							>
								{closeBtnTitle}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

Modal.propTyes = {
	open: PropTypes.bool,
	title: PropTypes.string,
	children: PropTypes.node.isRequired,
	footer: PropTypes.bool,
	submitBtnTitle: PropTypes.string,
	closeBtnTitle: PropTypes.string,
	onSubmit: PropTypes.func,
	onCancel: PropTypes.func.isRequired,
};

export default inject('ui')(observer(Modal));
