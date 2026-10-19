<?php
    $isDisabled = $isDisabled();
    $state = $getState();
?>

<div
    wire:key="<?php echo e($this->getId()); ?>.table.record.<?php echo e($recordKey); ?>.column.<?php echo e($getName()); ?>.toggle-column.<?php echo e($state ? 'true' : 'false'); ?>"
>
    <div
        x-data="{
            error: undefined,
            state: <?php echo \Illuminate\Support\Js::from((bool) $state)->toHtml() ?>,
            isLoading: false,
        }"
        wire:ignore
        <?php echo e($attributes
                ->merge($getExtraAttributes(), escape: false)
                ->class([
                    'fi-ta-toggle',
                    'px-3 py-4' => ! $isInline(),
                ])); ?>

    >
        <?php
            $offColor = $getOffColor() ?? 'gray';
            $onColor = $getOnColor() ?? 'primary';
        ?>

        <div
            role="switch"
            aria-checked="false"
            x-bind:aria-checked="state.toString()"
            wire:loading.attr="disabled"
            <?php if(! $isDisabled): ?>
                x-on:click.stop.prevent="
                    if (isLoading || $el.hasAttribute('disabled')) {
                        return
                    }

                    const updatedState = ! state

                    // Only update the state if the toggle is being turned off,
                    // otherwise it will flicker on twice when Livewire replaces
                    // the element.
                    if (state) {
                        state = false
                    }

                    isLoading = true

                    const response = await $wire.updateTableColumnState(
                        <?php echo \Illuminate\Support\Js::from($getName())->toHtml() ?>,
                        <?php echo \Illuminate\Support\Js::from($recordKey)->toHtml() ?>,
                        updatedState,
                    )

                    error = response?.error ?? undefined

                    // The state is only updated on the frontend if the toggle is
                    // being turned off, so we only need to reset it then.
                    if (! state && error) {
                        state = ! state
                    }

                    isLoading = false
                "
                x-tooltip="
                    error === undefined
                        ? false
                        : {
                              content: error,
                              theme: $store.theme,
                          }
                "
            <?php endif; ?>
            x-bind:class="
                (state
                    ? '<?php echo e(\Illuminate\Support\Arr::toCssClasses([
                            match ($onColor) {
                                'gray' => 'bg-gray-200 dark:bg-gray-700',
                                default => 'fi-color-custom bg-custom-600',
                            },
                            is_string($onColor) ? "fi-color-{$onColor}" : null,
                        ])); ?>'
                    : '<?php echo e(\Illuminate\Support\Arr::toCssClasses([
                            match ($offColor) {
                                'gray' => 'bg-gray-200 dark:bg-gray-700',
                                default => 'fi-color-custom bg-custom-600',
                            },
                            is_string($offColor) ? "fi-color-{$offColor}" : null,
                        ])); ?>') +
                    (isLoading ? ' opacity-70 pointer-events-none' : '')
            "
            x-bind:style="
                state
                    ? '<?php echo e(\Filament\Support\get_color_css_variables(
                            $onColor,
                            shades: [600],
                            alias: 'tables::columns.toggle-column.on',
                        )); ?>'
                    : '<?php echo e(\Filament\Support\get_color_css_variables(
                            $offColor,
                            shades: [600],
                            alias: 'tables::columns.toggle-column.off',
                        )); ?>'
            "
            class="<?php echo \Illuminate\Support\Arr::toCssClasses([
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent outline-none transition-colors duration-200 ease-in-out',
                'pointer-events-none opacity-70' => $isDisabled,
            ]); ?>"
        >
            <span
                class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                x-bind:class="{
                    'translate-x-5 rtl:-translate-x-5': state,
                    'translate-x-0': ! state,
                }"
            >
                <span
                    class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                    aria-hidden="true"
                    x-bind:class="{
                        'opacity-0 ease-out duration-100': state,
                        'opacity-100 ease-in duration-200': ! state,
                    }"
                >
                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($hasOffIcon()): ?>
                        <?php if (isset($component)) { $__componentOriginalbfc641e0710ce04e5fe02876ffc6f950 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'filament::components.icon','data' => ['icon' => $getOffIcon(),'class' => \Illuminate\Support\Arr::toCssClasses([
                                'fi-ta-toggle-off-icon h-3 w-3',
                                match ($offColor) {
                                    'gray' => 'text-gray-400 dark:text-gray-700',
                                    default => 'text-custom-600',
                                },
                            ])]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament::icon'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['icon' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($getOffIcon()),'class' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute(\Illuminate\Support\Arr::toCssClasses([
                                'fi-ta-toggle-off-icon h-3 w-3',
                                match ($offColor) {
                                    'gray' => 'text-gray-400 dark:text-gray-700',
                                    default => 'text-custom-600',
                                },
                            ]))]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950)): ?>
<?php $attributes = $__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950; ?>
<?php unset($__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalbfc641e0710ce04e5fe02876ffc6f950)): ?>
<?php $component = $__componentOriginalbfc641e0710ce04e5fe02876ffc6f950; ?>
<?php unset($__componentOriginalbfc641e0710ce04e5fe02876ffc6f950); ?>
<?php endif; ?>
                    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                </span>

                <span
                    class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                    aria-hidden="true"
                    x-bind:class="{
                        'opacity-100 ease-in duration-200': state,
                        'opacity-0 ease-out duration-100': ! state,
                    }"
                >
                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($hasOnIcon()): ?>
                        <?php if (isset($component)) { $__componentOriginalbfc641e0710ce04e5fe02876ffc6f950 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'filament::components.icon','data' => ['icon' => $getOnIcon(),'xCloak' => 'x-cloak','class' => \Illuminate\Support\Arr::toCssClasses([
                                'fi-ta-toggle-on-icon h-3 w-3',
                                match ($onColor) {
                                    'gray' => 'text-gray-400 dark:text-gray-700',
                                    default => 'text-custom-600',
                                },
                            ])]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament::icon'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['icon' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($getOnIcon()),'x-cloak' => 'x-cloak','class' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute(\Illuminate\Support\Arr::toCssClasses([
                                'fi-ta-toggle-on-icon h-3 w-3',
                                match ($onColor) {
                                    'gray' => 'text-gray-400 dark:text-gray-700',
                                    default => 'text-custom-600',
                                },
                            ]))]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950)): ?>
<?php $attributes = $__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950; ?>
<?php unset($__attributesOriginalbfc641e0710ce04e5fe02876ffc6f950); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalbfc641e0710ce04e5fe02876ffc6f950)): ?>
<?php $component = $__componentOriginalbfc641e0710ce04e5fe02876ffc6f950; ?>
<?php unset($__componentOriginalbfc641e0710ce04e5fe02876ffc6f950); ?>
<?php endif; ?>
                    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                </span>
            </span>
        </div>
    </div>
</div>
<?php /**PATH /var/www/html/vendor/filament/tables/resources/views/columns/toggle-column.blade.php ENDPATH**/ ?>