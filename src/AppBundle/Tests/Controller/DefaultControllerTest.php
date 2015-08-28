<?php

namespace AppBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Class DefaultControllerTest
 *
 * @package AppBundle\Tests\Controller
 */
class DefaultControllerTest extends WebTestCase
{

    /**
     * Test del index
     */
    public function testIndex()
    {
        $client = static::createClient();

        $client->request('GET', '/');

        $this->assertTrue($client->getResponse()->isRedirect(), "redirecciona al dashboard");

        $crawler = $client->followRedirect();

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertContains(' Tracker', $crawler->filter('h1')->text());
    }
}
