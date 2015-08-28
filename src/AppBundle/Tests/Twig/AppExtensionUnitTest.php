<?php
/**
 * Created by PhpStorm.
 * User: diegobarrioh
 * Date: 27/8/15
 * Time: 8:38
 */

namespace AppBundle\Tests\Twig;

use AppBundle\Twig\AppExtension;

/**
 * Class AppExtensionUnitTest
 *
 * @package AppBundle\Tests\Twig
 */
class AppExtensionUnitTest extends \PHPUnit_Framework_TestCase
{

    /**
     * Testing method spinner
     */
    public function testSpinner()
    {
    }

    /**
     * Testing method FormatAge
     */
    public function testFormatAge()
    {
        $appExtension = new AppExtension();
        $nacimiento   = new \DateTime('2015-12-21 20:59:00');

        $formatAge = $appExtension->formatAge($nacimiento);
        $this->assertContains(
            assert(
                strpos("año", $formatAge) ||
                strpos("años", $formatAge) ||
                strpos("mes", $formatAge) ||
                strpos("meses", $formatAge) ||
                strpos("dia", $formatAge)  ||
                strpos("dias", $formatAge)
            ),
            sprintf("Error es %s", $formatAge)
        );

    }

    /**
     * Testing method IsAssoc
     */
    public function testIsAssoc()
    {

    }

    /**
     * Testing method IconForMedicine
     */
    public function testIconForMedicine()
    {
    }

    /**
     * Testing method IconForFood
     */
    public function testIconForFood()
    {
    }
}