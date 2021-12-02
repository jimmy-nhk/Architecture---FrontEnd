import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const tags = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
  'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit'
];

function getStyles(name: string, tagName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      tagName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function TagsInput() {
  const theme = useTheme();
  const [tagName, setTagName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof tagName>) => {
    const {
      target: { value },
    } = event;
    setTagName(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl fullWidth sx={{ marginTop: "20px" }}>
        <InputLabel id="tags-label">Tags</InputLabel>
        <Select
          labelId="tags-label"
          id="tags"
          multiple
          value={tagName}
          onChange={handleChange}
          input={<OutlinedInput id="tags-select" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {tags.map((tag) => (
            <MenuItem
              key={tag}
              value={tag}
              style={getStyles(tag, tagName, theme)}
            >
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}