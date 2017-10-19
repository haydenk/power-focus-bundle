<?php

return [
    'name'        => 'Power Focus Bundle',
    'description' => 'This is an open-source version of the mPower Focus for Mautic',
    'version'     => '1.0',
    'author'      => 'Hayden King',

    'routes'   => [
        'main' => [
            'mautic_power_focus_index'  => [
                'path'         => '/focus/{page}',
                'controller'   => 'PowerFocusBundle:Default:index'
            ],
            'mautic_power_focus_action' => [
                'path'       => '/focus/{objectAction}/{objectId}',
                'controller' => 'PowerFocusBundle:Default:execute'
            ],
        ],
    ],

    'menu'     => [
        'main' => [
            'priority' => 35,
            'items'    => [
                'mautic.power_focus.root' => [
                    'iconClass' => 'fa-bullseye',
                    'children' => [
                        'mautic.power_focus.menu.index' => [
                            'route' => 'mautic_power_focus_index',
                        ],
                    ],
                ],
            ],
        ],
    ],

];
