import { IProcessedStyleSet, mergeStyleSets } from '@fluentui/react';
import { CSSProperties } from 'react';

interface FrameworkStyles {
  dropdownItemHeader: CSSProperties;
  root: CSSProperties;
  callout: CSSProperties;
  dropdownItem: CSSProperties;
  dropdownItemSelected: CSSProperties;
  dropdownOptionText?: CSSProperties;
  dropdownItems: {
    selectors: {
      [key: string]: CSSProperties,
    },
  };
}

export const frameworkStyles: FrameworkStyles = {
  dropdownItemHeader: {
    paddingBottom: '5px',
  },
  root: {
    paddingRight: '12px',
  },
  callout: {
    minWidth: 200,
    maxWidth: 200,
  },
  dropdownItem: {
    height: 'auto',
  },
  dropdownItemSelected: {
    height: 'auto',
  },
  dropdownOptionText: {
    whiteSpace: 'wrap !important',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownItems: {
    selectors: {
      '@media(min-width: 640px)': {
        maxHeight: 450,
      },
    },
  },
};

export const selectedFrameworkStyles: FrameworkStyles & { title: CSSProperties } = {
  ...frameworkStyles,
  title: {
    borderBottomColor: '#0F6CBD',
    borderBottomWidth: '2px',
  },
};

export const serviceStyles: FrameworkStyles = {
  dropdownItemHeader: {
    paddingBottom: '5px',
  },
  root: {
    paddingRight: '12px',
  },
  callout: {
    minWidth: 220,
    maxWidth: 220,
  },
  dropdownItem: {
    height: 'auto',
  },
  dropdownItemSelected: {
    height: 'auto',
  },
  dropdownItems: {
    selectors: {
      '@media(min-width: 640px)': {
        maxHeight: 450,
      },
    },
  },
};

export const selectedServiceStyles: FrameworkStyles & { title: CSSProperties } = {
  ...serviceStyles,
  title: {
    borderBottomColor: '#0F6CBD',
    borderBottomWidth: '2px',
  },
};

export const controlStyles: FrameworkStyles = {
  dropdownItemHeader: {
    paddingBottom: '5px',
  },
  root: {
    paddingRight: '12px',
  },
  callout: {
    minWidth: 320,
    maxWidth: 320,
  },
  dropdownItem: {
    height: 'auto',
  },
  dropdownItemSelected: {
    height: 'auto',
  },
  dropdownItems: {
    selectors: {
      '@media(min-width: 640px)': {
        maxHeight: 450,
      },
    },
  },
};

export const selectedControlStyles: FrameworkStyles & { title: CSSProperties } = {
  ...controlStyles,
  title: {
    borderBottomColor: '#0F6CBD',
    borderBottomWidth: '2px',
  },
};

export const styles: IProcessedStyleSet<{
  selectedTitle: CSSProperties;
  optionHeader: CSSProperties;
}> = mergeStyleSets({
  selectedTitle: {
    color: '#0F6CBD',
  },
  optionHeader: {
    lineHeight: '20px',
    marginTop: '5px',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
  },
});
