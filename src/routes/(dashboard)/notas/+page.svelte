<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

    type Nota = {
        author: string,
        title: string,
        content: string
    }

	let notas: Nota[] = [
		{
			author: 'Sergio',
			title: 'Notas',
			content: 'Notas de Sergio'
		},
		{
			author: 'Sergio',
			title: 'Notas',
			content: 'Notas de Sergio'
		}
	];
</script>

<h1>Notas</h1>

{#each notas as note}
	<div class="card mb-3">
		<div class="card-body">
			<h4 class="card-title">{note.author} - {note.title}</h4>
			<div class="card-text mb-3">
				<textarea class="form-control" rows="3">{note.content}</textarea>
			</div>
            <button type="button" class="btn btn-primary">Button</button>
		</div>
	</div>
{/each}
