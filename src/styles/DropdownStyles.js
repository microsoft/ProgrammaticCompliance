import { mergeStyleSets } from '@fluentui/react';

export const frameworkStyles = {
  dropdownItemHeader: {
    paddingBottom: '5px',
  },
  root: {
    paddingRight: '12px',
  },
  callout: {
    minWidth: 200,
    maxwidth: 200,
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
      "@media(min-width: 640px)": {
        maxHeight: 450
      }
    }
  }
};

export const selectedFrameworkStyles = {
  ...frameworkStyles,
  title: {
    borderBottomColor: '#0F6CBD',
    borderBottomWidth: '2px',
  }
};

export const serviceStyles = {
  dropdownItemHeader: {
    paddingBottom: '5px',
  },
  root: {
    paddingRight: '12px',
  },
  callout: {
    minWidth: 220,
    maxwidth: 220,
  },
  dropdownItem: {
    height: 'auto',
  },
  dropdownItemSelected: {
    height: 'auto',
  },
  dropdownItems: {
    selectors: {
      "@media(min-width: 640px)": {
        maxHeight: 450
      }
    }
  }
};

export const selectedServiceStyles = {
  ...serviceStyles,
  title: {
    borderBottomColor: '#0F6CBD',
    borderBottomWidth: '2px',
  }
};

export const controlStyles = {
  dropdownItemHeader: {
    paddingBottom: '5px',
  },
  root: {
    paddingRight: '12px',
  },
  callout: {
    minWidth: 320,
    maxwidth: 320,
  },
  dropdownItem: {
    height: 'auto',
  },
  dropdownItemSelected: {
    height: 'auto',
  },
  dropdownItems: {
    selectors: {
      "@media(min-width: 640px)": {
        maxHeight: 450
      }
    }
  }
};

export const selectedControlStyles = {
  ...controlStyles,
  title: {
    borderBottomColor: '#0F6CBD',
    borderBottomWidth: '2px',
  }
};

export const styles = mergeStyleSets({
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
