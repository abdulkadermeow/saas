<?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(isset($data)): ?>
    <script>
        window.filamentData = <?php echo \Illuminate\Support\Js::from($data)->toHtml() ?>
    </script>
<?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

<?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $assets; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $asset): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(! $asset->isLoadedOnRequest()): ?>
        <?php echo e($asset->getHtml()); ?>

    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

<style>
    :root {
        <?php $__currentLoopData = $cssVariables ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cssVariableName => $cssVariableValue): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?> --<?php echo e($cssVariableName); ?>:<?php echo e($cssVariableValue); ?>; <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    }
</style>
<?php /**PATH /var/www/html/vendor/filament/support/resources/views/assets.blade.php ENDPATH**/ ?>