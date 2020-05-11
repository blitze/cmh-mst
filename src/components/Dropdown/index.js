import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Transition, useToggleLayer, Arrow } from 'react-laag';
import ResizeObserver from 'resize-observer-polyfill';
import classnames from 'classnames';

function Dropdown({
	type = 'div',
	containerClass = 'dropdown',
	dropdownClass,
	className,
	arrow,
	renderTrigger,
	renderContent,
	...rest
}) {
	const [layerElement, layerProps] = useToggleLayer(
		({ isOpen, layerProps, arrowStyle, layerSide, close }) => {
			const classNames = classnames({
				'dropdown-menu shadow': true,
				[dropdownClass]: !!dropdownClass,
				show: isOpen,
			});

			return (
				<Transition isOpen={isOpen}>
					{(isOpen, onTransitionEnd) => (
						<div
							ref={layerProps.ref}
							onTransitionEnd={onTransitionEnd}
							className={classNames}
							style={{
								...layerProps.style,
								zIndex: 2000,
								opacity: isOpen ? 1 : 0,
								transition: 'opacity 0.2s',
							}}
						>
							{renderContent(close, isOpen)}
							{arrow && (
								<Arrow
									style={arrowStyle}
									layerSide={layerSide}
									size={8}
									angle={45}
									roundness={1}
									borderWidth={1}
									borderColor="#00000026"
									backgroundColor="white"
								/>
							)}
						</div>
					)}
				</Transition>
			);
		},
		{
			placement: {
				anchor: 'BOTTOM_CENTER',
				autoAdjust: true,
				triggerOffset: 4,
				scrollOffset: 16,
			},
			closeOnOutsideClick: true,
			ResizeObserver,
		},
	);

	const toggle = e => {
		e.preventDefault();
		if (layerProps.isOpen) {
			layerProps.close();
		} else {
			layerProps.openFromMouseEvent(e);
		}
	};

	const classNames = classnames({
		[containerClass]: !!containerClass,
		[className]: !!className,
	});

	// return type ? (
	// 	React.createElement(type, { className: classes, ...rest }, [
	// 		layerElement,
	// 		renderTrigger(toggle),
	// 	])
	// ) : (
	// 	<div className={classes} {...rest}>
	// 		{layerElement}
	// 		{renderTrigger(toggle)}
	// 	</div>
	// );

	return (
		<div className={classNames} {...rest}>
			{layerElement}
			{renderTrigger(toggle)}
		</div>
	);
}

Dropdown.propTypes = {
	containerClass: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	dropdownClass: PropTypes.string,
	className: PropTypes.string,
	arrow: PropTypes.bool,
	renderTrigger: PropTypes.func.isRequired,
	renderContent: PropTypes.func.isRequired,
};

export default observer(Dropdown);
