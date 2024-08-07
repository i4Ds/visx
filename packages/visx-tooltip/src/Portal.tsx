import React from 'react';
import ReactDOM from 'react-dom';

export type PortalProps = {
  /** Optional z-index to set on the Portal. */
  zIndex?: number | string;
  /**
   * If elements that go beyond the existing `body` extent should be clipped.
   * @default true
   */
  hideOverflow?: boolean;
  /** Content to render in the Portal. */
  children: NonNullable<React.ReactNode>;
};

/** Render within a portal using a declarative component API. */
export default class Portal extends React.PureComponent<PortalProps> {
  private node?: HTMLDivElement;

  componentWillUnmount() {
    if (this.node && document.body) {
      document.body.removeChild(this.node);
      delete this.node;
    }
  }

  render() {
    // SSR check
    if (!this.node && typeof document !== 'undefined') {
      this.node = document.createElement('div');
      if (this.props.hideOverflow !== false) {
        this.node.style.position = 'absolute';
        this.node.style.top = '0';
        this.node.style.height = '100%';
        this.node.style.width = '100%';
        this.node.style.overflow = 'hidden';
        this.node.style.pointerEvents = 'none';
        this.node.style.touchAction = 'none';
      }
      if (this.props.zIndex != null) this.node.style.zIndex = `${this.props.zIndex}`;
      document.body.append(this.node);
    }

    if (!this.node) {
      return null;
    }

    return ReactDOM.createPortal(this.props.children, this.node);
  }
}
