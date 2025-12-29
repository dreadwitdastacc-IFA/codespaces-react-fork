"""Interactive CLI for the Cooking AI Agent."""
import sys
from rich import print
from rich.prompt import Prompt
from agent import search_recipes, extract_ingredients
from recipes import RECIPES

HELP = '''Commands:
- search <query>     Search recipes by keyword
- show <id>          Show recipe details (id from search)
- extract <id>       Extract ingredients for a recipe using the model (or fallback)
- help               Show this help
- quit               Exit
'''


def show_recipe(recipe):
    print(f"[bold]{recipe['title']}[/bold] (id: {recipe['id']})")
    print('\nIngredients:')
    for ing in recipe['ingredients']:
        print(f" - {ing}")
    print('\nSteps:')
    for i, s in enumerate(recipe['steps'], 1):
        print(f" {i}. {s}")


def main():
    print('[green]Cooking AI Agent CLI[/green]')
    print(HELP)
    last_results = []
    while True:
        try:
            raw = Prompt.ask('[cyan]cmd[/cyan]')
        except (KeyboardInterrupt, EOFError):
            print('\nExiting')
            return
        if not raw:
            continue
        parts = raw.strip().split(' ', 1)
        cmd = parts[0].lower()
        arg = parts[1].strip() if len(parts) > 1 else ''

        if cmd == 'search':
            if not arg:
                print('[yellow]Provide a query. Example: search pasta[/yellow]')
                continue
            results = search_recipes(arg)
            last_results = results
            if not results:
                print('[red]No recipes found.[/red]')
                continue
            for r in results:
                print(f"- {r['id']}: {r['title']}")

        elif cmd == 'show':
            if not arg:
                print('[yellow]Provide a recipe id. Example: show r1[/yellow]')
                continue
            r = next((x for x in RECIPES if x['id'] == arg), None)
            if not r:
                print('[red]Recipe not found.[/red]')
                continue
            show_recipe(r)

        elif cmd == 'extract':
            if not arg:
                print('[yellow]Provide a recipe id to extract ingredients from.[/yellow]')
                continue
            r = next((x for x in RECIPES if x['id'] == arg), None)
            if not r:
                print('[red]Recipe not found.[/red]')
                continue
            text = '\n'.join([r['title']] + r['steps'])
            print('[blue]Requesting ingredient extraction...[/blue]')
            items = extract_ingredients(text)
            print('[green]Ingredients extracted:[/green]')
            for it in items:
                print(f" - {it}")

        elif cmd == 'help':
            print(HELP)

        elif cmd == 'quit' or cmd == 'exit':
            print('Goodbye')
            return

        else:
            print('[red]Unknown command[/red]')


if __name__ == '__main__':
    main()
