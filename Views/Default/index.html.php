<?php

$view->extend('MauticCoreBundle:Default:content.html.php');

$view['slots']->set('mauticContent', 'powerFocus');
$view['slots']->set("headerTitle", $view['translator']->trans('mautic.power_focus.list.header.index'));

$view['slots']->set('actions', $view->render('MauticCoreBundle:Helper:page_actions.html.php', [
    'templateButtons' => ['new' => true],
    'routeBase' => 'power_focus',
    'langVar'   => 'pfocus.list',
]));
?>

<div class="panel panel-default bdr-t-wdh-0">
    <?php echo $view->render('MauticCoreBundle:Helper:list_toolbar.html.php', array(
        'searchValue' => $searchValue,
        'searchHelp'  => 'mautic.power_focus.help.searchcommands',
        'action'      => $currentRoute,
        'langVar'     => 'pfocus.list',
        'routeBase'   => 'power_focus',
        'templateButtons' => [
            'delete' => true,
        ]
    )); ?>
    <div class="page-list">
        <?php $view['slots']->output('_content'); ?>
    </div>
</div>