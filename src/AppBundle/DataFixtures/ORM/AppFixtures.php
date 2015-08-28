<?php
/**
 * Created by PhpStorm.
 * User: diegobarrioh
 * Date: 21/8/15
 * Time: 9:06
 */

namespace AppBundle\DataFixtures\ORM;

use Hautelook\AliceBundle\Alice\DataFixtureLoader;
use Nelmio\Alice\Fixtures;

/**
 * Class AppFixtures
 *
 * @package AppBundle\DataFixtures\ORM
 */
class AppFixtures extends DataFixtureLoader
{
    /**
     * Devuelva aleatoriamente el nombre de los posibles iconos
     *
     * @return mixed
     */
    public function iconName()
    {
        $names = array(
            'primary',
            'warning',
            'success',
            'info',
            'danger',
        );

        return $names[array_rand($names)];
    }

    /**
     * {@inheritDoc}
     */
    protected function getFixtures()
    {
        return  array(
            __DIR__.'/event_types.yml',
        );
    }

}
