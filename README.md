# Nice Clock

A simple analog clock extension for GNOME Shell, displayed on the top panel.

## Installation

1. Download the repo:
```bash
git clone https://github.com/moshe-stein24/gnome-nice-clock/
```

2. Create the extension directory:
```bash
mkdir ~/.local/share/gnome-shell/extensions/analog-clock@$(whoami)
```

3. Copy necessary files:
```bash
cd gnome-nice-clock/
```

```bash
cp extension.js stylesheet.css metadata.json ~/.local/share/gnome-shell/extensions/analog-clock@$(whoami)
```

4. Restart GNOME Shell: 

Press alt + F2 and type: 'restart' -> press enter


5. Enable the extension:
```bash
gnome-extensions enable analog-clock@$(whoami)
```

6. ENJOY!
   'YOU HAVE A CLOCK IN THE TOP BAR'
   it will show the time with like dials black and white really cool:)


## Features

- Real analog clock with hour and minute hands
- 24×24px (compact size)
- Updates every 500ms
- Positioned on the right side of the panel
- Works with GNOME 40-46

## Files

- `extension.js` - Main extension code
- `metadata.json` - Extension metadata
- `stylesheet.css` - Styling

## License

GPL-3.0
