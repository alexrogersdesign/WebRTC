import React, {useContext, useEffect} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import ToolTip, {TooltipProps} from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import {OptionsContext} from '../../context/OptionsContext';
import {ChildrenPropsMandatory} from '../../shared/types';

type StyleProps = React.CSSProperties

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => {
  const borderStyle = `${theme.palette.text.secondary} 1px solid`;
  return createStyles({
    tooltip: (props) => ({
      display: props.display,
      color: theme.palette.text.primary,
      backgroundColor: '#ffff8b',
      border: borderStyle,
    }),
    arrow: (props) => ({
      'display': props.display,
      'color': '#ffff8b',
      '&:before': {
        border: borderStyle,
      },
      'popper': {
        top: '50%',
      },
    }),
  });
},
);

interface Props extends ChildrenPropsMandatory{
    message: string,
    tooltipProps?: Omit<TooltipProps, 'children' | 'title'>,
    ariaLabeledBy?: string,
    ariaDescribedBy?: string
    style?:React.CSSProperties
    watchItem?: any,
}
/**
 * A component that wraps provided children and displays a help prompt.
 * @param {React.FC} children A component to wrap as a tutorial.
 * @param {string} message The tutorial message to display.
 * @param {TooltipProps} tooltipProps An object containing props to pass to the
 * tooltip component
 * @param {React.CSSProperties} style Styles to pass to the Tooltip component
 * @param {string} ariaDescribedBy string for aria-describedby
 * @param {string} ariaLabeledBy string for aria-describedby
 * @param {any} watchItem An item to watch. If the provided item changes,
 * the component will rerender. This is helpful to update the location
 * of the tutorial message the component its wrapping has changed
 * its position.
 * @return {React.FC}
 */
const TutorialWrapper= ({
  children,
  message,
  tooltipProps,
  style,
  ariaDescribedBy,
  ariaLabeledBy,
  watchItem,
}: Props) => {
  const classes = useStyles(style?? {});
  const {helpOpen} = useContext(OptionsContext);
  const [dummyState, updateDummyState] = React.useState(false);
  /* force a component to update (rerender) by changing dummy state
  * that is not actually used*/
  const forceUpdate = React.useCallback(
      () => updateDummyState(!dummyState), [watchItem]);
  /** Force component to update when watchItem changes */
  useEffect(() => {
    setTimeout(()=>forceUpdate(), 250);
  }, [watchItem]);

  return (
    <ToolTip
      aria-describedby={ariaDescribedBy?? undefined}
      aria-labelledby={ariaLabeledBy?? undefined}
      PopperProps={{
        disablePortal: true,
      }}
      classes={{
        tooltipArrow: classes.tooltip,
        arrow: classes.arrow,
        popper: classes.popper,
      }}
      TransitionComponent={Fade}
      TransitionProps={{timeout: 600}}
      open={helpOpen}
      title={message}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      arrow
      {...tooltipProps}
    >
      {children}
    </ToolTip>
  );
};

export default TutorialWrapper;
