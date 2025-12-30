# Editor integration — Fugitive statusline

Show Git status from vim-fugitive in your statusline.

Prerequisite
- Install tpope/vim-fugitive (or your plugin manager of choice).

Vimscript (safe) 
Vimscript (simple) 
Neovim (init.lua)
```lua
require('lualine').setup{
	sections = {
		lualine_c = {
			function()
				if vim.fn.exists('*FugitiveStatusline') == 1 then
					return vim.fn['FugitiveStatusline']()
				end
				return ''
			end
		}
	}
}
```
