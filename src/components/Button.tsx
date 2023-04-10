import React, {
  ForwardedRef,
  ReactElement,
  Ref,
  forwardRef,
  useRef,
} from 'react';
import styled from 'styled-components';

import colors from '../../constants/colors';
import typo from '../../constants/typography';

type Type = 'button' | 'reset' | 'submit';
type Variant = 'filled' | 'tonal' | 'outline' | 'text';
type Color = 'primary' | 'secondary' | 'tertiary' | 'warning';

export interface ButtonProps {
  readonly accept?: string;
  readonly children?: string | ReactElement;
  readonly className?: string;
  readonly color?: Color;
  readonly disabled?: boolean;
  readonly endIcon?: ReactElement;
  readonly innerRef?: Ref<HTMLButtonElement>;
  readonly isFileInput?: boolean;
  readonly onBlur?: () => void;
  readonly onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  readonly onChange?: (e: React.ChangeEvent<HTMLButtonElement>) => void;
  readonly onMouseDown?: () => void;
  readonly onMouseEnter?: () => void;
  readonly onMouseLeave?: () => void;
  readonly onMouseOut?: () => void;
  readonly onMouseOver?: () => void;
  readonly onMouseUp?: () => void;
  readonly startIcon?: ReactElement;
  readonly title?: string;
  readonly type?: Type;
  readonly variant?: Variant;
}

export interface StyledButtonTypes {
  readonly child?: boolean;
  readonly color: Color;
  readonly disabled?: boolean;
  readonly endIcon?: boolean;
  readonly startIcon?: boolean;
  readonly variant?: Variant;
}

const StyledButton = styled.button<StyledButtonTypes>`
  align-items: center;
  background-color: transparent;
  border-radius: 8px;
  border: none;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-family: ${typo.RobotoSans};
  font-size: 16px;
  font-weight: 400;
  gap: 8px;
  justify-content: center;
  line-height: 1.15;
  letter-spacing: 0.1px;
  padding: 8px
    ${({ child, startIcon, endIcon }) =>
      !child && (startIcon || endIcon) ? `16px` : `24px`};
  svg {
    width: 16px;
  }

  ${({ disabled }) => `cursor: ${disabled ? 'default' : 'pointer'};`}

  ${({ color, disabled, variant }) => {
    let bgColor = '';
    let bgColorHover = '';
    let hoverShadow = '';
    let outlineColor = '';
    let outlineHover = '';
    let tonalBgColor = '';
    let tonalBgColorHover = '';
    let textColor = '';
    let tonalTextColor = '';
    switch (color) {
      case 'primary':
        bgColor = disabled ? colors.gray[100] : colors.purple[50];
        bgColorHover = disabled ? '' : colors.purple[60];
        hoverShadow = disabled
          ? ''
          : '1px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)';
        outlineColor = disabled ? colors.gray[70] : colors.purple[50];
        outlineHover = disabled ? '' : colors.purple[95];
        tonalBgColor = disabled ? colors.gray[100] : colors.purple[80];
        tonalBgColorHover = disabled ? '' : colors.purple[90];
        textColor = disabled ? colors.gray[70] : colors.white;
        tonalTextColor = disabled ? colors.gray[70] : colors.gray[10];
        break;
      case 'secondary':
        bgColor = disabled ? colors.gray[100] : colors.blue[50];
        bgColorHover = disabled ? '' : colors.blue[60];
        hoverShadow = disabled
          ? ''
          : '1px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)';
        outlineColor = disabled ? colors.gray[70] : colors.blue[50];
        outlineHover = disabled ? '' : colors.blue[95];
        tonalBgColor = disabled ? colors.gray[100] : colors.blue[80];
        tonalBgColorHover = disabled ? '' : colors.blue[90];
        textColor = disabled ? colors.gray[70] : colors.white;
        break;
      case 'warning':
        bgColor = disabled ? colors.gray[100] : colors.red[50];
        bgColorHover = disabled ? '' : colors.red[60];
        outlineColor = disabled ? colors.gray[70] : colors.red[50];
        outlineHover = disabled ? '' : colors.red[95];
        tonalBgColor = disabled ? colors.gray[100] : colors.red[80];
        tonalBgColorHover = disabled ? '' : colors.red[90];
        textColor = disabled ? colors.gray[70] : colors.white;
        hoverShadow = disabled
          ? ''
          : '1px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)';
        break;
      default:
        break;
    }

    switch (variant) {
      case 'filled':
        return `
          background-color: ${bgColor};
          color: ${textColor};
          &:hover {
            background-color: ${bgColorHover};
            box-shadow: ${hoverShadow};
          }
          &:active{
            background-color: ${bgColor};
            box-shadow: none;
          }
        `;
      case 'tonal':
        return `
            background-color: ${tonalBgColor};
            color: ${tonalTextColor};
            &:hover {
              background-color: ${tonalBgColorHover};
              box-shadow: ${hoverShadow};
            }
            &:active{
              background-color: ${tonalBgColor};
              box-shadow: none;
            }
          `;
      case 'outline':
        // Used outline to maintain button height and width
        // Override browser outline on :focus
        return `
          color: ${outlineColor};
          outline: 1px solid ${outlineColor};
          outline-offset: -1px;
          &:focus {
            outline: 1px solid ${bgColor};
          }
          &:hover {
            background-color: ${outlineHover};
            color: ${bgColorHover};
            outline: 1px solid ${bgColorHover};
          }
          &:active{
            background-color: ${tonalBgColorHover};
          }
        `;
      case 'text':
        return `
          color: ${outlineColor};
          &:hover {
            background-color: ${outlineHover};
            color: ${bgColorHover};
          }
          &:active{
            background-color: ${tonalBgColorHover};
          }
        `;
      default:
        return ``;
    }
  }}
`;

const Button = ({
  accept,
  children,
  className,
  color = 'primary',
  disabled = false,
  endIcon,
  innerRef,
  isFileInput = false,
  onBlur,
  onChange,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  startIcon,
  title,
  type = 'button',
  variant = 'filled',
}: ButtonProps) => {
  const inputFile = useRef<HTMLInputElement | null>(null);
  return (
    <StyledButton
      child={!!children}
      className={className}
      color={color}
      disabled={disabled}
      endIcon={!!endIcon}
      onBlur={onBlur}
      onClick={(e) => {
        if (isFileInput) {
          inputFile?.current?.click();
        }
        if (typeof onClick === 'function') {
          onClick(e);
        }
      }}
      onChange={onChange}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      ref={innerRef}
      startIcon={!!startIcon}
      title={title}
      type={type}
      variant={variant}
    >
      {startIcon}
      {children}
      {isFileInput && (
        <input
          accept={accept}
          id={`FileUpload-${Date.now().toString(16)}`}
          ref={inputFile}
          style={{ display: 'none' }}
          type="file"
        />
      )}
      {endIcon}
    </StyledButton>
  );
};

const ButtonWithRef = forwardRef(
  (props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => (
    <Button {...props} innerRef={ref} />
  ),
);

export default ButtonWithRef;
