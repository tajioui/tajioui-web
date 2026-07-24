<script lang="ts">
	let { dim = false }: { dim?: boolean } = $props();
</script>

<div class="aura" class:dim aria-hidden="true"><i></i></div>
<div class="grain" aria-hidden="true"></div>

<style>
	.aura {
		position: fixed;
		inset: -30%;
		z-index: 0;
		pointer-events: none;
		filter: blur(20px);
	}
	.aura.dim {
		opacity: 0.35;
	}
	.aura::before,
	.aura::after {
		content: '';
		position: absolute;
		border-radius: 50%;
		mix-blend-mode: screen;
		will-change: transform;
	}
	.aura::before {
		width: 60vmax;
		height: 60vmax;
		left: -10vmax;
		top: -14vmax;
		background: radial-gradient(circle at center, var(--glow1), transparent 60%);
		animation: drift1 34s ease-in-out infinite alternate;
	}
	.aura::after {
		width: 52vmax;
		height: 52vmax;
		right: -8vmax;
		bottom: -12vmax;
		background: radial-gradient(circle at center, var(--glow2), transparent 60%);
		animation: drift2 42s ease-in-out infinite alternate;
	}
	.aura i {
		position: absolute;
		width: 44vmax;
		height: 44vmax;
		left: 40%;
		top: 30%;
		border-radius: 50%;
		mix-blend-mode: screen;
		will-change: transform;
		background: radial-gradient(circle at center, var(--glow3), transparent 60%);
		animation: drift3 50s ease-in-out infinite alternate;
	}
	@keyframes drift1 {
		to {
			transform: translate3d(14vmax, 10vmax, 0) scale(1.15);
		}
	}
	@keyframes drift2 {
		to {
			transform: translate3d(-12vmax, -8vmax, 0) scale(1.1);
		}
	}
	@keyframes drift3 {
		to {
			transform: translate3d(-16vmax, 12vmax, 0) scale(1.2);
		}
	}
	.grain {
		position: fixed;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		opacity: 0.035;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}
	@media (prefers-reduced-motion: reduce) {
		.aura::before,
		.aura::after,
		.aura i {
			animation: none;
		}
	}
</style>
