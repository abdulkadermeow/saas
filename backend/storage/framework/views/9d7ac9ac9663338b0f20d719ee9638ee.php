<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'disabled' => false,
    'prefix' => null,
    'required' => false,
    'suffix' => null,
    'tag' => 'label',
]));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter(([
    'disabled' => false,
    'prefix' => null,
    'required' => false,
    'suffix' => null,
    'tag' => 'label',
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars); ?>

<<?php echo e($tag); ?>

    <?php echo e($attributes->class(['fi-fo-field-wrp-label inline-flex items-center gap-x-3'])); ?>

>
    <?php echo e($prefix); ?>


    <span class="text-sm font-medium leading-6 text-gray-950 dark:text-white">
        
        <?php echo e($slot); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($required && (! $disabled)): ?><sup class="text-danger-600 dark:text-danger-400 font-medium">*</sup>
        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    </span>

    <?php echo e($suffix); ?>

</<?php echo e($tag); ?>>
<?php /**PATH /var/www/html/vendor/filament/forms/resources/views/components/field-wrapper/label.blade.php ENDPATH**/ ?>